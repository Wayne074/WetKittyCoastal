export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Soft-close merch shop / catalog / cart.
 * Flip to `true` when products & graphics are ready — Printful data stays intact.
 * Founding Crew (`/founding-crew`) is independent and stays live either way.
 */
const SHOP_PUBLIC = false;

// Private preview: visiting any page with ?preview=wkcrew26 unlocks the full shop
// for that browser tab session (for QA while the public site shows Coming Soon).
function previewUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get("preview") === "wkcrew26") sessionStorage.setItem("wk-preview", "1");
    return sessionStorage.getItem("wk-preview") === "1";
  } catch {
    return false;
  }
}

export const SHOP_OPEN = SHOP_PUBLIC || previewUnlocked();

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

/** Customer support inbox (shown sitewide). */
export const SUPPORT_EMAIL = "bigcat@wetkittycoastal.com";

/** Shipping, matching what Stripe Checkout charges. */
export const SHIPPING_SUMMARY =
  "$5.99 flat shipping, free on orders over $100. Made to order and delivered in about 5–12 business days.";

/** Set the page title and meta description (client-side SEO). */
export function setPageMeta(title: string, description?: string, image?: string) {
  if (typeof document === "undefined") return;
  document.title = title;
  const set = (selector: string, attr: string, key: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  if (description) {
    set('meta[name="description"]', "name", "description", description);
    set('meta[property="og:description"]', "property", "og:description", description);
  }
  set('meta[property="og:title"]', "property", "og:title", title);
  if (image) set('meta[property="og:image"]', "property", "og:image", image);
}

/** Web-sized image (resized WebP via an image CDN); falls back to the original on error. */
export function webImage(url: string | undefined | null, width = 600) {
  if (!url) return "";
  if (!/^https:\/\/files\.cdn\.printful\.com\//.test(url)) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=82`;
}
