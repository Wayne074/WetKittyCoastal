import { describe, expect, it } from "vitest";
import { isSaleTitle, SALE_ACTIVE, salePriceAmount } from "../shared/commerce/sale";

describe("grand opening sale", () => {
  it("includes tees and hoodies only while the sale is active", () => {
    for (const title of [
      "Race Club Tee",
      "Yacht & Rod Club Women’s Tee (Wet Kitty)",
      "Wet Kitty Coastal Lifestyle Pullover Hoodie",
      "Wet Kitty Wave Apparel Zip Hoodie",
      "Wet Kitty Brand Mark Hoodie",
    ])
      expect(isSaleTitle(title), title).toBe(SALE_ACTIVE);
  });
  it("excludes everything else", () => {
    for (const title of [
      "WKC Letterman Jacket",
      "Wet Kitty Brand Mark Babydoll",
      "Salty Soul Wild Heart Women’s Raglan Baby Tee",
      "Wet Kitty Brand Mark Crop Tank",
      "Wet Kitty Paw Skater Dress",
      "Yacht & Rod Club Dad Hat (Wet Kitty)",
      "Wet Kitty Coastal Brand Mark Sticker",
      "Wet Kitty Wave Apparel Koozie",
      "Wet Kitty Brand Mark Flag",
      "Wet Kitty Wave Bike Beach Towel",
    ])
      expect(isSaleTitle(title), title).toBe(false);
  });
  it("takes SALE_PERCENT off, rounded to the cent", () => {
    // Pure math helper — independent of SALE_ACTIVE.
    expect(salePriceAmount("38.95")).toBe("29.21");
    expect(salePriceAmount("32.00")).toBe("24.00");
    expect(salePriceAmount("54.99")).toBe("41.24");
  });
});
