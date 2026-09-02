import { describe, expect, it } from "vitest";
import { isPrintfulConfigured, listProducts } from "./_core/printful";

const configured = isPrintfulConfigured();

describe.skipIf(!configured)("Printful catalog smoke test", () => {
  it(
    "returns at least one purchasable product",
    { timeout: 30_000 },
    async () => {
      const products = await listProducts({ first: 10 });
      expect(
        products.some(
          product =>
            product.title.trim().length > 0 &&
            Boolean(product.images[0]?.url) &&
            product.variants.some(variant => Number(variant.price.amount) > 0)
        )
      ).toBe(true);
    }
  );
});

describe.skipIf(configured)(
  "Printful catalog smoke test (not connected)",
  () => {
    it("is skipped until PRINTFUL_API_TOKEN is configured", () => {
      expect(true).toBe(true);
    });
  }
);
