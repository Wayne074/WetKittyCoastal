/**
 * Grand Opening Sale. One switch for the whole site: the server prices the
 * catalog (and so the cart and Stripe Checkout) with these helpers, and the
 * client only renders what the server returns.
 *
 * To end the sale, set SALE_ACTIVE = false and deploy.
 */

export const SALE_ACTIVE = true;
export const SALE_PERCENT = 25;
export const SALE_BANNER = "Grand Opening Sale — 25% off tees & hoodies";

const EXCLUDED =
  /\b(babydoll|baby tee|raglan|crop tank|tank|dress|letterman|varsity|jacket|hat|cap|sticker|koozie|flag|towel)\b/i;
const TEE = /\b(tee|t-shirt|tshirt)\b/i;
const HOODIE = /\b(hoodie|pullover)\b/i;

/** Men's and women's tees, pullover hoodies, and zip hoodies. */
export function isSaleTitle(title: string) {
  if (!SALE_ACTIVE) return false;
  if (EXCLUDED.test(title)) return false;
  return TEE.test(title) || HOODIE.test(title);
}

/** Sale price for a decimal price string, rounded to the nearest cent. */
export function salePriceAmount(amount: string) {
  const cents = Math.round(Number.parseFloat(amount) * 100);
  if (!Number.isFinite(cents)) return amount;
  const sale = Math.round((cents * (100 - SALE_PERCENT)) / 100);
  return (sale / 100).toFixed(2);
}

/** Original price paired with a product's lowest price, when it is on sale. */
export function compareAtForLowest(
  variants: Array<{ price: { amount: string }; compareAtPrice: { amount: string } | null }>
) {
  let best: (typeof variants)[number] | undefined;
  for (const v of variants)
    if (!best || Number.parseFloat(v.price.amount) < Number.parseFloat(best.price.amount))
      best = v;
  return best?.compareAtPrice?.amount;
}
