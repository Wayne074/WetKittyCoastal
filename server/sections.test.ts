import { describe, expect, it } from "vitest";
import {
  classifyProductSection,
  productSections,
} from "@shared/commerce/sections";

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
    ["Wet Kitty Wave Print Skater Dress", "women"],
    ["Wet Kitty Sky High Club Flag", "accessories"],
    ["Wet Kitty Wave Bike Beach Towel", "accessories"],
    ["Wet Kitty Coastal Lifestyle Pullover Hoodie", "hoodies"],
    ["Wet Kitty Paw Skater Dress - Pink", "women"],
  ])("%s → %s", (name, section) => {
    expect(classifyProductSection(name)).toBe(section);
  });

  it.each([
    ["Yacht & Rod Club Men’s Tee", ["club", "women"]],
    ["Wet Kitty Coastal Lifestyle Tee", ["coastal-ride", "women"]],
    ["Wet Kitty Coastal Lifestyle Women's Tee", ["women"]],
    ["Wet Kitty Brand Mark Crop Tank", ["women"]],
    ["Wet Kitty Coastal Lifestyle Zip Hoodie", ["hoodies"]],
    ["Wet Kitty Brand Mark Flag", ["accessories"]],
  ])("%s lists in %j", (name, sections) => {
    expect(productSections(name)).toEqual(sections);
  });
});
