/**
 * Default "Featured" order for Shop All (and, filtered, for every section).
 *
 * The first six are hand-picked so the first screen on desktop (4 across) and
 * mobile (2 across) shows six different designs across six product types:
 * flagship tee, hat, zip hoodie, club tee, sticker, women's piece. The rest
 * alternate product type and design so no two neighbours repeat. Products not
 * listed here (new Printful listings) are appended, interleaved by section.
 * Keyed by Printful sync product id.
 */
export const FEATURED_ORDER: string[] = [
  "475069001", // Yacht & Rod Club Men's Tee — flagship tee
  "475058494", // Brand Mark Dad Hat — hat
  "475066883", // Wave Apparel Zip Hoodie — zip hoodie
  "475046079", // Sky High Club Tee — club tee
  "475048514", // Wave Bike Sticker — sticker
  "475065897", // Salty Soul Wild Heart Women's Raglan Baby Tee — women's
  "475046373", // Race Club Tee
  "475070138", // Yacht & Rod Club Pullover Hoodie
  "475047937", // Brand Mark Crop Tank
  "475068027", // Wave Apparel Koozie
  "475057564", // Wave Bike Tee
  "475069318", // Yacht & Rod Club Women's Tee
  "475071041", // Yacht & Rod Club Dad Hat
  "475056771", // Down Low Club Tee
  "475067424", // Wave Apparel Hoodie
  "475067704", // Brand Mark Babydoll
  "475070422", // Yacht & Rod Club Sticker
  "475046677", // Race Club Civic Tee
  "475069764", // Yacht & Rod Club Zip Hoodie
  "475048215", // Salty Soul Wild Heart Tee
  "475058883", // Brand Mark Sticker
  "475047637", // Brand Mark Tee
  "475065629", // Brand Mark Hoodie
  "475061553", // Wave Apparel Women's Tee
  "475057186", // Wave Bike Dad Hat
  "475050986", // Coastal Highway Tee
  "475061289", // Wave Apparel Tee
  "475052995", // Coastal Highway Women's Tee
];

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
