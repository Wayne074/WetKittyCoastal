/**
 * Storefront sections (collections).
 *
 * `classifyProductSection` assigns the primary section. Men's Club and
 * Women's Club also list the same unisex tees (and Men's Club lists unisex
 * hoodies) so one SKU can be merchandised in both clubs without a duplicate
 * product. Women's-cut pieces stay out of Men's Club. Hats, caps, koozies,
 * beach towels, stickers and similar small goods live in Accessories.
 */

export type ShopSectionHandle =
  | "men"
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
  /**
   * When false, the section stays a classification bucket but is not linked
   * from the nav, footer, or homepage collection cards.
   */
  customerNav?: boolean;
};

export const SHOP_SECTIONS: ShopSection[] = [
  {
    handle: "men",
    navLabel: "Men's Club",
    title: "The Night Starts on the Water.",
    subtitle: "Men's Club",
    tagline: "Built for weekends that don't end when the sun goes down.",
    description:
      "From the Gulf to the garage and everywhere in between.",
  },
  {
    handle: "women",
    navLabel: "Women's Club",
    title: "Sun on the Water. Lights After.",
    subtitle: "Women's Club",
    tagline: "Beach days, boat nights, and whatever comes next.",
    description:
      "Wet Kitty cuts for women who live the weekend instead of dressing for it.",
  },
  {
    handle: "club",
    navLabel: "Club",
    title: "Pick Your Club.",
    subtitle: "The Club Collection",
    tagline: "Pick a club and wear it loud.",
    description:
      "Sky High, Race Club, Down Low, Yacht and Rod. For the boat, the garage, or out with your people.",
    // "Club" by itself is vague next to Men's Club and Women's Club.
    customerNav: false,
  },
  {
    handle: "coastal-ride",
    navLabel: "Coastal & Ride",
    title: "Salt and the Open Road.",
    subtitle: "Coastal & Ride",
    tagline: "Salt air meets the open road.",
    description: "Two sides of the same Wet Kitty weekend.",
  },
  {
    handle: "hoodies",
    navLabel: "Hoodies",
    title: "When the Sun Drops.",
    subtitle: "Hoodies & Zips",
    tagline: "For the bonfire, the cool ride, and a night that's still going.",
    description:
      "Pullovers and zips for when the Gulf air drops and nobody is ready to head in.",
  },
  {
    handle: "accessories",
    navLabel: "Accessories",
    title: "Finish the Look.",
    subtitle: "Hats, Stickers & Accessories",
    tagline: "The small stuff that finishes the weekend.",
    description:
      "Hats, stickers, koozies, and towels for the truck, the boat, and the bar.",
  },
];

/**
 * Sections shown in the header, footer, and homepage collection cards.
 * "Club" stays in `SHOP_SECTIONS` so club-design tees still classify, and
 * those tees remain listed in Men's Club, Women's Club, and Shop All.
 */
export const CUSTOMER_NAV_SECTIONS = SHOP_SECTIONS.filter(
  section => section.customerNav !== false
);

/**
 * Old collection URLs that now point at a new section (or Shop All).
 * `/collections/club` goes to Shop All, not Men's Club: the club bucket is
 * the shared unisex named-club tees, which are merchandised in both clubs.
 * Women's cuts, hoodies, and accessories never lived only in that bucket.
 */
export const LEGACY_COLLECTION_REDIRECTS: Record<string, string> = {
  hats: "/collections/accessories",
  beach: "/collections/coastal-ride",
  "limited-drop": "/collections/apparel",
  club: "/collections/apparel",
};

const ACCESSORY =
  /\b(hat|hats|cap|caps|snapback|trucker|beanie|visor|sticker|stickers|koozie|koozies|towel|towels|mug|tumbler|bottle|patch|patches|tote|bag|keychain|magnet|poster|pin|flag|flags)\b/;
const HOODIE =
  /\b(hoodie|hoodies|sweatshirt|pullover|zip|fleece|crewneck|jacket)\b/;
const WOMEN =
  /\b(women|women's|womens|ladies|babydoll|crop|raglan|bikini|dress|dresses|skirt)\b/;
const CLUB = /\bclub\b/;

/**
 * Deterministic primary section from a product's name (plus the blank name
 * when available). Order matters: accessories and hoodies win over audience,
 * then women's-cut pieces, then the club designs, and the rest are coastal
 * & ride tees. Men's Club is a cross-list, not a primary bucket.
 */
export function classifyProductSection(
  text: string
): Exclude<ShopSectionHandle, "men"> {
  const value = text.toLowerCase().replace(/[’`]/g, "'");
  if (ACCESSORY.test(value)) return "accessories";
  if (HOODIE.test(value)) return "hoodies";
  if (WOMEN.test(value)) return "women";
  if (CLUB.test(value)) return "club";
  return "coastal-ride";
}

const TEE = /\b(tee|tees|t-shirt|shirt)\b/;

/**
 * Every section a product is listed in, primary section first. Unisex tees
 * are also listed in Men's Club and Women's Club. Unisex hoodies are also
 * listed in Men's Club. Women's-cut pieces stay in Women's Club only.
 * Shop All still lists each product once.
 */
export function productSections(text: string): ShopSectionHandle[] {
  const primary = classifyProductSection(text);
  const value = text.toLowerCase().replace(/[’`]/g, "'");
  if ((primary === "club" || primary === "coastal-ride") && TEE.test(value))
    return [primary, "men", "women"];
  if (primary === "hoodies") return ["hoodies", "men"];
  return [primary];
}

export function getShopSection(handle: string) {
  return SHOP_SECTIONS.find(section => section.handle === handle) ?? null;
}
