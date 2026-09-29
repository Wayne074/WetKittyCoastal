import { describe, expect, it } from "vitest";
import { displayTitle } from "./_core/printful";
import { customerDescription } from "@shared/commerce/copy";
import {
  FEATURED_ORDER,
  MEN_ORDER,
  WOMEN_UNISEX_ORDER,
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
  });
});
