/**
 * Default "Featured" order for Shop All.
 *
 * The first eight are hand-picked so the first screen (4 across on desktop,
 * 2 across on mobile) mixes a women's tee, a hat, a hoodie, a sticker, a
 * color tee, a babydoll, a koozie, and a different club tee. Not a row of
 * similar black backs. Products missing from this list are appended,
 * interleaved by section. Keyed by Printful sync product id.
 */
export const FEATURED_ORDER: string[] = [
  "475065897", // Salty Soul women's raglan — colorful women's tee
  "475058494", // Brand Mark dad hat
  "475066883", // Wave Apparel zip hoodie
  "475048514", // Wave Bike sticker
  "476302437", // Wave Bike tee — front
  "475067704", // Brand Mark babydoll — front
  "475068027", // Wave Apparel koozie
  "476296287", // Race Club tee — front
  "475071041", // Yacht & Rod Club dad hat
  "476309361", // Coastal Lifestyle tee — front
  "475246981", // Wave Bike beach towel
  "476307026", // Yacht & Rod Club men's tee — front
  "475247521", // Paw skater dress
  "475070422", // Yacht & Rod Club sticker
  "476295516", // Sky High Club tee — front
  "475057186", // Wave Bike dad hat
  "476301010", // Salty Soul tee — front
  "478997139", // WKC Letterman Jacket
  "475069764", // Yacht & Rod Club zip hoodie
  "476310836", // Coastal Lifestyle women's tee — front
  "475058883", // Brand Mark sticker
  "475050986", // Coastal Highway tee — front
  "475070138", // Yacht & Rod Club pullover hoodie
  "475052995", // Coastal Highway women's tee — front
  "475246968", // Yacht & Rod Club flag
  "476302132", // Down Low Club tee — front
  "475067424", // Wave Apparel hoodie
  "476306159", // Salty Soul women's raglan — front
  "475061289", // Wave Apparel tee — front
  "475246973", // Sky High Club flag
  "476298400", // Race Club Street tee — front
  "475047937", // Brand Mark crop tank
  "475246971", // Brand Mark flag
  "475047637", // Brand Mark tee — front
  "475065629", // Brand Mark hoodie
  "475061553", // Wave Apparel women's tee — front
  "475069001", // Yacht & Rod Club men's tee — back
  "475046079", // Sky High Club tee — back
  "475057564", // Wave Bike tee — back
  "475046373", // Race Club tee — back
  "475048215", // Salty Soul tee — back
  "475056771", // Down Low Club tee — back
  "475046677", // Race Club Street tee — back
  "475069318", // Yacht & Rod Club women's tee — back
  "475246689", // Coastal Lifestyle tee — back
  "475246695", // Coastal Lifestyle women's tee — back
  "475246703", // Coastal Lifestyle pullover hoodie
  "475246699", // Coastal Lifestyle zip hoodie
];

/**
 * Men's Club order: boats, cars, bikes, then the ride home.
 * Different from Women's Club on purpose.
 */
export const MEN_ORDER: string[] = [
  "476307026", // Yacht & Rod — boats and fishing
  "476302132", // Down Low — trucks
  "476296287", // Race Club — cars
  "476298400", // Race Club Street — cars
  "476302437", // Wave Bike — bikes
  "476295516", // Sky High — guys' night
  "475050986", // Coastal Highway — front
  "476301010", // Salty Soul — front
  "475066883", // Wave zip hoodie
  "475069764", // Yacht zip hoodie
  "478997139", // WKC Letterman Jacket
  "475047637", // Brand Mark tee — front
  "475070138", // Yacht pullover
  "475067424", // Wave hoodie
  "475061289", // Wave Apparel tee — front
  "476309361", // Coastal Lifestyle — front
  "475069001", // Yacht — back
  "475046373", // Race — back
  "475046079", // Sky High — back
  "475057564", // Wave Bike — back
  "475046677", // Race Street — back
  "475056771", // Down Low — back
  "475048215", // Salty — back
  "475065629", // Brand Mark hoodie
  "475246699", // Coastal Lifestyle zip
  "475246703", // Coastal Lifestyle pullover
  "475246689", // Coastal Lifestyle tee — back
];

/** Women's-cut pieces, her order: night-out and beach cuts before the rest. */
export const WOMEN_CUT_ORDER: string[] = [
  "475067704", // Babydoll — front
  "476306159", // Salty Soul raglan — front
  "475052995", // Coastal Highway women's — front
  "476310836", // Coastal Lifestyle women's — front
  "475061553", // Wave Apparel women's — front
  "475047937", // Crop tank
  "475247521", // Paw skater dress
  "475065897", // Salty Soul raglan — back
  "476306462", // Babydoll — back
  "475069318", // Yacht women's — back
  "475246695", // Coastal Lifestyle women's — back
];

/**
 * Unisex tees inside Women's Club. Beach and night first, not the men's
 * boat-and-race lead.
 */
export const WOMEN_UNISEX_ORDER: string[] = [
  "476301010", // Salty Soul — beach day
  "476295516", // Sky High — girls' night
  "476309361", // Coastal Lifestyle — beach into night
  "475050986", // Coastal Highway — front
  "476302437", // Wave Bike — boats and the ride
  "475061289", // Wave Apparel — front
  "476307026", // Yacht — her night on the boat
  "476296287", // Race Club — nightlife
  "475048215", // Salty — back
  "475246689", // Coastal Lifestyle — back
  "475057564", // Wave Bike — back
  "475069001", // Yacht — back
  "475046079", // Sky High — back
  "475046373", // Race — back
];

export function sortByPreference<T extends { id: string }>(
  products: T[],
  order: string[]
): T[] {
  const rank = new Map(order.map((id, index) => [id, index]));
  return products
    .map((product, index) => ({ product, index }))
    .sort((a, b) => {
      const ra = rank.get(a.product.id) ?? 10_000;
      const rb = rank.get(b.product.id) ?? 10_000;
      if (ra !== rb) return ra - rb;
      return a.index - b.index;
    })
    .map(item => item.product);
}

/**
 * Sort products into the featured order. Unlisted products keep a stable,
 * section-interleaved order after the curated list.
 */
export function sortFeatured<T extends { id: string; tags?: string[] }>(
  products: T[]
): T[] {
  const rank = new Map(FEATURED_ORDER.map((id, index) => [id, index]));
  const listed = products
    .filter(product => rank.has(product.id))
    .sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);

  const bySection = new Map<string, T[]>();
  for (const product of products) {
    if (rank.has(product.id)) continue;
    const key = product.tags?.[0] ?? "other";
    bySection.set(key, [...(bySection.get(key) ?? []), product]);
  }
  const queues = Array.from(bySection.values());
  const rest: T[] = [];
  while (queues.some(queue => queue.length))
    for (const queue of queues) {
      const next = queue.shift();
      if (next) rest.push(next);
    }
  return [...listed, ...rest];
}

type CardImage = { url: string; altText?: string | null };

/**
 * Lead the card with a non-black color when the product has one, rotating
 * through the gallery so neighboring cards don't all open on black.
 * Remaining URLs stay as fallbacks if the first file fails.
 */
/** Alt text for a hoodie back shot. Cards skip it so the chest front leads. */
export const HOODIE_BACK_ALT = "Back of the hoodie";

/** Any garment-back shot ("Back of the hoodie", "Back of the jacket, …"). */
const BACK_SHOT_ALT = /^back of the\b/i;

export function cardImageUrls(images: CardImage[] | undefined, index: number) {
  const list = (images ?? []).filter(image => image.url);
  if (!list.length) return [];
  // A back shot has no color in the alt, so the old "skip black" rule was
  // choosing it (or a blank front thumbnail) over the printed chest.
  const fronts = list.filter(image => !BACK_SHOT_ALT.test(image.altText ?? ""));
  const poolSource = fronts.length ? fronts : list;
  const colored = poolSource.filter(
    image => !/\bblack\b/i.test(image.altText ?? "")
  );
  const pool = colored.length ? colored : poolSource;
  const lead = pool[index % pool.length];
  const urls = [lead.url, ...list.map(image => image.url)];
  return urls.filter((url, i) => urls.indexOf(url) === i);
}
