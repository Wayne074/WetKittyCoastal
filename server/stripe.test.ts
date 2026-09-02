import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Cart } from "@shared/commerce/types";
import { createCheckoutSession, verifyStripeWebhook } from "./_core/stripe";

const fetchMock = vi.fn();

const cart: Cart = {
  id: "signed-cart",
  checkoutUrl: "",
  itemCount: 2,
  subtotal: { amount: "64.00", currencyCode: "USD" },
  total: { amount: "64.00", currencyCode: "USD" },
  items: [
    {
      lineId: "8801",
      variantId: "8801",
      productHandle: "ride-the-tide-tee-77",
      productTitle: "Ride the Tide Tee",
      variantTitle: "Black / L",
      image: { url: "https://example.com/tee.jpg", altText: "Tee" },
      unitPrice: { amount: "32.00", currencyCode: "USD" },
      quantity: 2,
      lineTotal: { amount: "64.00", currencyCode: "USD" },
    },
  ],
};

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  process.env.STRIPE_SECRET_KEY = "sk_test_wetkitty";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_wetkitty";
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_WEBHOOK_SECRET;
});

describe("Stripe checkout", () => {
  it("uses the server-validated price and preserves the Printful variant id", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        id: "cs_test_1",
        url: "https://checkout.stripe.com/test",
      }),
    } as Response);

    const result = await createCheckoutSession(
      cart,
      "https://wetkittycoastal.com"
    );
    expect(result.url).toBe("https://checkout.stripe.com/test");

    const [, init] = fetchMock.mock.calls[0];
    const params = new URLSearchParams(String(init.body));
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("3200");
    expect(params.get("line_items[0][quantity]")).toBe("2");
    expect(
      params.get(
        "line_items[0][price_data][product_data][metadata][printful_variant_id]"
      )
    ).toBe("8801");
    expect(
      params.get(
        "shipping_options[0][shipping_rate_data][fixed_amount][amount]"
      )
    ).toBe("599");
    expect(params.get("success_url")).toContain(
      "wetkittycoastal.com/checkout/success"
    );
  });

  it("accepts a current valid webhook signature and rejects a bad one", () => {
    const raw = Buffer.from(
      JSON.stringify({
        id: "evt_1",
        type: "checkout.session.completed",
        data: { object: { id: "cs_1" } },
      })
    );
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", "whsec_wetkitty")
      .update(`${timestamp}.`)
      .update(raw)
      .digest("hex");

    expect(verifyStripeWebhook(raw, `t=${timestamp},v1=${signature}`).id).toBe(
      "evt_1"
    );
    expect(() => verifyStripeWebhook(raw, `t=${timestamp},v1=bad`)).toThrow(
      "Invalid Stripe signature"
    );
  });
});
