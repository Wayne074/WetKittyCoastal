import { afterEach, describe, expect, it } from "vitest";
import {
  buildPrintfulOrder,
  printfulExternalId,
  printfulOrderConfirm,
} from "./_core/printful";

const order = {
  stripeSessionId: "cs_test_safe",
  stripeLivemode: false,
  recipient: {
    name: "Test Buyer",
    email: "test-buyer@example.com",
    phone: "+15555550123",
    address1: "1 Test Street",
    address2: null,
    city: "Panama City",
    stateCode: "FL",
    countryCode: "US",
    zip: "32401",
  },
  items: [
    { variantId: "5525187364", quantity: 1, retailPrice: "34.00" },
  ],
};

afterEach(() => {
  delete process.env.PRINTFUL_LIVE_FULFILLMENT;
  delete process.env.WETKITTY_SKIP_PRINTFUL;
});

describe("Printful draft safety", () => {
  it("never confirms a test-mode Stripe payment", () => {
    process.env.PRINTFUL_LIVE_FULFILLMENT = "true";
    expect(printfulOrderConfirm(false)).toBe(false);
    expect(buildPrintfulOrder(order).path).toBe(
      "/orders?confirm=false&update_existing=true"
    );
  });

  it("keeps live confirmation off until the live flag is set", () => {
    expect(printfulOrderConfirm(true)).toBe(false);
    expect(buildPrintfulOrder({ ...order, stripeLivemode: true }).path).toContain(
      "confirm=false"
    );
    process.env.PRINTFUL_LIVE_FULFILLMENT = "true";
    expect(printfulOrderConfirm(true)).toBe(true);
    expect(buildPrintfulOrder({ ...order, stripeLivemode: true }).path).toContain(
      "confirm=true"
    );
  });

  it("preserves the variant, quantity, recipient, shipping, and retail price", () => {
    const built = buildPrintfulOrder(order);
    expect(printfulExternalId(order.stripeSessionId)).toHaveLength(32);
    expect(built.body).toEqual({
      external_id: printfulExternalId(order.stripeSessionId),
      shipping: "STANDARD",
      recipient: {
        name: "Test Buyer",
        email: "test-buyer@example.com",
        phone: "+15555550123",
        address1: "1 Test Street",
        address2: undefined,
        city: "Panama City",
        state_code: "FL",
        country_code: "US",
        zip: "32401",
      },
      items: [
        { sync_variant_id: 5525187364, quantity: 1, retail_price: "34.00" },
      ],
    });
  });

  it("does not confirm when the live switch is off, even for a live session", () => {
    delete process.env.PRINTFUL_LIVE_FULFILLMENT;
    expect(buildPrintfulOrder({ ...order, stripeLivemode: true }).path).toBe(
      "/orders?confirm=false&update_existing=true"
    );
  });
});
