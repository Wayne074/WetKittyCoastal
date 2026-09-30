import { describe, expect, it } from "vitest";
import { displayTitle, garmentBackUrl } from "./_core/printful";
import { customerDescription } from "@shared/commerce/copy";
import {
  FEATURED_ORDER,
  HOODIE_BACK_ALT,
  MEN_ORDER,
  WOMEN_UNISEX_ORDER,
  cardImageUrls,
} from "@shared/commerce/featured";

describe("display titles keep Front and Back", () => {
  it("appends the print side when a hardcoded override omits it", () => {
    expect(displayTitle(475069001, "Yacht & Rod Club Men’s Tee — Back")).toBe(
      "Yacht & Rod Club Men’s Tee — Back"
    );
    expect(displayTitle(475046079, "Sky High Club Tee — Front")).toBe(
      "Sky High Club Tee — Front"
    );
  });

  it("leaves overrides alone when the store name has no side", () => {
    expect(
      displayTitle(
        475069001,
        "Yacht & Rod Club Softstyle Tee (men’s) (Wet Kitty)"
      )
    ).toBe("Yacht & Rod Club Men’s Tee");
  });

  it("strips the internal Wet Kitty suffix but keeps the side", () => {
    expect(
      displayTitle(475069318, "Yacht & Rod Club Women’s Tee (Wet Kitty) — Back")
    ).toBe("Yacht & Rod Club Women’s Tee — Back");
  });
});

describe("customer copy", () => {
  it("leads with the life, not a catalog spec", () => {
    const copy = customerDescription({
      title: "Yacht & Rod Club Men’s Tee — Back",
      backPrint: true,
    });
    expect(copy.startsWith("Full Wet Kitty")).toBe(false);
    expect(copy.toLowerCase()).not.toContain("printful");
    expect(copy.toLowerCase()).not.toContain("gildan");
    expect(copy).toContain("One large graphic on the back.");
    expect(copy).toContain("$5.99");
    expect(copy).toContain("5–12 business days");
  });
});

describe("shop all variety", () => {
  it("does not open on four similar tees", () => {
    const first = FEATURED_ORDER.slice(0, 4);
    expect(first).toEqual(["475065897", "475058494", "475066883", "475048514"]);
  });

  it("merchandises unisex tees differently for each club", () => {
    expect(MEN_ORDER[0]).not.toBe(WOMEN_UNISEX_ORDER[0]);
    expect(MEN_ORDER.slice(0, 4)).toEqual([
      "476307026",
      "476302132",
      "476296287",
      "476298400",
    ]);
    expect(WOMEN_UNISEX_ORDER[0]).toBe("476301010");
    expect(WOMEN_UNISEX_ORDER[1]).toBe("476295516");
  });
});

describe("club voice", () => {
  it("does not use the men's line on a women's club product", () => {
    const title = "Salty Soul Wild Heart Tee — Front";
    const his = customerDescription({ title, backPrint: false });
    const hers = customerDescription({
      title,
      backPrint: false,
      womensCut: true,
    });
    expect(his).not.toBe(hers);
    expect(hers.toLowerCase()).toContain("girls' night");
    expect(hers.toLowerCase()).not.toContain("his attention");
    expect(hers.toLowerCase()).not.toContain("printful");
    expect(hers.toLowerCase()).not.toContain("gildan");
    expect(hers.toLowerCase()).not.toContain("30-day");
    expect(his.toLowerCase()).toContain("guys");
  });
});

describe("hoodie cards", () => {
  it("leads with a front, not the back shot", () => {
    const urls = cardImageUrls(
      [
        { url: "https://example.test/black-front.png", altText: "Hoodie / Black / S" },
        { url: "https://example.test/back.png", altText: HOODIE_BACK_ALT },
        { url: "https://example.test/navy-front.png", altText: "Hoodie / Navy / S" },
      ],
      0
    );
    expect(urls[0]).toBe("https://example.test/navy-front.png");
    expect(urls).toContain("https://example.test/back.png");
  });
});


describe("hoodie back gallery", () => {
  it("uses a real garment-back thumbnail and never a raw print file", () => {
    const raw = new Set(["https://files.example/back-print.png"]);
    expect(
      garmentBackUrl(
        "475070138",
        "https://files.example/yacht-back-mockup.png",
        raw
      )
    ).toBe("https://files.example/yacht-back-mockup.png");
    expect(
      garmentBackUrl("475246703", "https://files.example/blank-front.png", raw)
    ).toBeNull();
    expect(
      garmentBackUrl("475067424", "https://files.example/back-print.png", raw)
    ).toBeNull();
  });
});
