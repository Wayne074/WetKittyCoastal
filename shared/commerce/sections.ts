/**
 * Storefront sections (collections).
 *
 * Every Printful product is assigned to exactly ONE section by
 * `classifyProductSection` so the shop stays balanced and nothing appears as
 * padding in multiple places. Hats, caps, koozies, beach towels, stickers and
 * similar small goods all live in Accessories.
 */

export type ShopSectionHandle =
  | "club"
  | "coastal-ride"
  | "women"
  | "hoodies"
  | "accessories";

export type ShopSection = {
  handle: ShopSectionHandle;
  /** Short label for navigation. */
  navLabel: string;
  /** Brand name shown on the homepage collection card. */
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
};

export const SHOP_SECTIONS: ShopSection[] = [
  {
    handle: "club",
    navLabel: "Club",
    title: "Sunset Riders",
    subtitle: "The Club Collection",
    tagline: "Pick your club. Wear it loud.",
    description:
      "Sky High, Race Club, Down Low, and Yacht & Rod Club graphic tees — the Wet Kitty clubs for riders, racers, and dock-side legends.",
  },
  {
    handle: "coastal-ride",
    navLabel: "Coastal & Ride",
    title: "High Tide",
    subtitle: "Coastal & Ride Tees",
    tagline: "Saltwater, chrome, and the open highway.",
    description:
      "Coastal Highway, Wave Bike, Salty Soul, Wave Apparel, and Brand Mark tees built for beach days and bike nights.",
  },
  {
    handle: "women",
    navLabel: "Women",
    title: "Low Tide",
    subtitle: "Women's Collection",
    tagline: "Flirty, beachy, and still premium.",
    description:
      "Women's tees, raglan baby tees, babydolls, and crop tanks in the newest Wet Kitty graphics.",
  },
  {
    handle: "hoodies",
    navLabel: "Hoodies",
    title: "Salt Run",
    subtitle: "Hoodies & Zips",
    tagline: "When the sun drops and the fire starts.",
    description:
      "Pullover and zip hoodies for beach bonfires, cool rides, and late-night rally afterparties.",
  },
  {
    handle: "accessories",
    navLabel: "Accessories",
    title: "Pier 7",
    subtitle: "Hats, Stickers & Accessories",
    tagline: "Top it off. Stick it on. Keep it cold.",
    description:
      "Dad hats, caps, stickers, koozies, beach towels, and the small stuff that finishes the look.",
  },
];

/** Old collection URLs that now point at a new section (or Shop All). */
export const LEGACY_COLLECTION_REDIRECTS: Record<string, string> = {
  men: "/collections/apparel",
  hats: "/collections/accessories",
  beach: "/collections/coastal-ride",
  "limited-drop": "/collections/apparel",
};

const ACCESSORY =
  /\b(hat|hats|cap|caps|snapback|trucker|beanie|visor|sticker|stickers|koozie|koozies|towel|towels|mug|tumbler|bottle|patch|patches|tote|bag|keychain|magnet|poster|pin)\b/;
const HOODIE = /\b(hoodie|hoodies|sweatshirt|pullover|zip|fleece|crewneck|jacket)\b/;
const WOMEN = /\b(women|women's|womens|ladies|babydoll|crop|raglan|bikini)\b/;
const CLUB = /\bclub\b/;

/**
 * Deterministic section assignment from a product's name (plus the Printful
 * blank name when available). Order matters: accessories and hoodies win over
 * audience, then women's, then the club designs, and the rest are
 * coastal & ride tees.
 */
export function classifyProductSection(text: string): ShopSectionHandle {
  const value = text.toLowerCase().replace(/[’`]/g, "'");
  if (ACCESSORY.test(value)) return "accessories";
  if (HOODIE.test(value)) return "hoodies";
  if (WOMEN.test(value)) return "women";
  if (CLUB.test(value)) return "club";
  return "coastal-ride";
}

export function getShopSection(handle: string) {
  return SHOP_SECTIONS.find(section => section.handle === handle) ?? null;
}
