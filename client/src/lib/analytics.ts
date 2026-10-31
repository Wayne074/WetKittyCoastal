/**
 * Lightweight GA4 event helper. The Google tag is installed in index.html.
 * Do not send fake purchase events from a success URL: payment verification
 * and transaction deduplication must happen on the server first.
 */
type GAItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params ?? {});
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  trackEvent("page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  });
}

export function trackCommerceEvent(
  name: "add_to_cart" | "begin_checkout",
  items: GAItem[],
  value: number,
  currency = "USD"
) {
  trackEvent(name, { currency, value, items });
}
