import { describe, expect, it } from "vitest";
import { classifyProductSection } from "@shared/commerce/sections";

describe("shop sections", () => {
  it.each([
    ["Yacht & Rod Club Dad Hat", "accessories"],
    ["Wet Kitty Wave Apparel Koozie", "accessories"],
    ["Wet Kitty Wave Bike Sticker", "accessories"],
    ["Wet Kitty Beach Towel", "accessories"],
    ["Yacht & Rod Club Zip Hoodie", "hoodies"],
    ["Wet Kitty Brand Mark Hoodie", "hoodies"],
    ["Yacht & Rod Club Women’s Tee", "women"],
    ["Wet Kitty Brand Mark Crop Tank", "women"],
    ["Wet Kitty Brand Mark Babydoll", "women"],
    ["Yacht & Rod Club Men’s Tee", "club"],
    ["Race Club Civic Tee", "club"],
    ["Wet Kitty Coastal Highway Tee", "coastal-ride"],
    ["Salty Soul Wild Heart Tee", "coastal-ride"],
  ])("%s → %s", (name, section) => {
    expect(classifyProductSection(name)).toBe(section);
  });
});
