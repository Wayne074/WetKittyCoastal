import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SALE_ACTIVE,
  salePriceAmount,
} from "../shared/commerce/sale";
import type { TrpcContext } from "./_core/context";
import { resetPrintfulCatalogCache } from "./_core/printful";
import { appRouter } from "./routers";

function makeCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

const fetchMock = vi.fn();

const RETAIL = "32.00";
const UNIT = SALE_ACTIVE ? salePriceAmount(RETAIL) : RETAIL;
const UNIT_CENTS = String(Math.round(Number.parseFloat(UNIT) * 100));

const summary = {
  id: 77,
  name: "Ride the Tide Tee",
  variants: 1,
  synced: 1,
  thumbnail_url: "https://example.com/tee.jpg",
};

const detail = {
  sync_product: summary,
  sync_variants: [
    {
      id: 8801,
      name: "Ride the Tide Tee - Black / L",
      synced: true,
      retail_price: RETAIL,
      currency: "USD",
      product: { variant_name: "Black / L" },
      files: [{ type: "preview", preview_url: "https://example.com/tee.jpg" }],
      options: [
        { id: "color", value: "Black" },
        { id: "size", value: "L" },
      ],
    },
  ],
};

function ok(result: unknown) {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({ code: 200, result }),
  } as Response);
}

function mockCatalog() {
  ok([summary]);
  ok(detail);
}

beforeEach(() => {
  fetchMock.mockReset();
  resetPrintfulCatalogCache();
  vi.stubGlobal("fetch", fetchMock);
  process.env.PRINTFUL_API_TOKEN = "printful-test-token";
  process.env.CART_SIGNING_SECRET = "cart-test-secret-with-enough-entropy";
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.PRINTFUL_API_TOKEN;
  delete process.env.CART_SIGNING_SECRET;
});

describe("Printful commerce", () => {
  it("normalizes the Printful catalog into storefront product shapes", async () => {
    mockCatalog();
    const products = await appRouter
      .createCaller(makeCtx())
      .commerce.products.list();
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: "77",
      handle: "ride-the-tide-tee-77",
      title: "Ride the Tide Tee",
      vendor: "Wet Kitty Coastal",
    });
    expect(products[0].variants[0]).toMatchObject({
      id: "8801",
      price: { amount: UNIT, currencyCode: "USD" },
      compareAtPrice: SALE_ACTIVE
        ? { amount: RETAIL, currencyCode: "USD" }
        : null,
      selectedOptions: [
        { name: "color", value: "Black" },
        { name: "size", value: "L" },
      ],
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.printful.com/store/products?limit=100"
    );
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer printful-test-token"
    );
  });

  it("creates a tamper-resistant cart and supports quantity changes", async () => {
    mockCatalog();
    const caller = appRouter.createCaller(makeCtx());
    const created = await caller.commerce.cart.create({
      lines: [{ variantId: "8801", quantity: 2 }],
    });
    expect(created.itemCount).toBe(2);
    expect(created.subtotal.amount).toBe(
      (Number.parseFloat(UNIT) * 2).toFixed(2)
    );
    expect(created.items[0].productTitle).toBe("Ride the Tide Tee");

    const updated = await caller.commerce.cart.updateLines({
      cartId: created.id,
      lines: [{ lineId: "8801", quantity: 3 }],
    });
    expect(updated?.itemCount).toBe(3);
    expect(updated?.subtotal.amount).toBe(
      (Number.parseFloat(UNIT) * 3).toFixed(2)
    );

    const removed = await caller.commerce.cart.removeLines({
      cartId: updated!.id,
      lineIds: ["8801"],
    });
    expect(removed.itemCount).toBe(0);
  });

  it("charges the server-side sale price in Stripe Checkout", async () => {
    mockCatalog();
    process.env.STRIPE_SECRET_KEY = "sk_test_wetkitty";
    const caller = appRouter.createCaller(makeCtx());
    const created = await caller.commerce.cart.create({
      lines: [{ variantId: "8801", quantity: 2 }],
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "cs_test_1", url: "https://checkout.stripe.com/t" }),
    } as Response);
    await caller.commerce.cart.checkout({
      cartId: created.id,
      origin: "https://wetkittycoastal.com",
    });
    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/checkout/sessions")
    )!;
    const params = new URLSearchParams(String(call[1].body));
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe(
      UNIT_CENTS
    );
    expect(params.get("line_items[0][quantity]")).toBe("2");
    // Subtotal stays under the $100 threshold, so flat shipping applies.
    expect(
      params.get("shipping_options[0][shipping_rate_data][fixed_amount][amount]")
    ).toBe("599");
    delete process.env.STRIPE_SECRET_KEY;
  });

  it("rejects a modified cart token", async () => {
    mockCatalog();
    const caller = appRouter.createCaller(makeCtx());
    const created = await caller.commerce.cart.create({
      lines: [{ variantId: "8801", quantity: 1 }],
    });
    const tampered = `${created.id.slice(0, -1)}x`;
    await expect(
      caller.commerce.cart.get({ cartId: tampered })
    ).resolves.toBeNull();
  });

  it("reports an unconnected Printful account clearly", async () => {
    delete process.env.PRINTFUL_API_TOKEN;
    await expect(
      appRouter.createCaller(makeCtx()).commerce.products.list()
    ).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
    });
  });
});
