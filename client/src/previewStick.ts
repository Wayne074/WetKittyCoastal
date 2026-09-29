/** Keep ?preview=wkcrew26 on every in-app URL while the shop is closed.
 *  A browser that opens each page fresh (no shared sessionStorage) still sees the shop.
 *  The public site stays on Coming Soon unless this query is present.
 */
const KEY = "wkcrew26";
const STORAGE = "wk-preview";

function unlocked(): boolean {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get("preview") === KEY) sessionStorage.setItem(STORAGE, "1");
    return sessionStorage.getItem(STORAGE) === "1";
  } catch {
    return false;
  }
}

function stamp(raw: string): string {
  const u = new URL(raw, window.location.origin);
  if (u.origin !== window.location.origin) return raw;
  if (u.searchParams.get("preview") === KEY) return u.pathname + u.search + u.hash;
  u.searchParams.set("preview", KEY);
  return u.pathname + u.search + u.hash;
}

function fixAnchor(a: HTMLAnchorElement) {
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  let u: URL;
  try {
    u = new URL(href, window.location.origin);
  } catch {
    return;
  }
  if (u.origin !== window.location.origin) return;
  if (u.searchParams.get("preview") === KEY) return;
  u.searchParams.set("preview", KEY);
  a.setAttribute("href", u.pathname + u.search + u.hash);
}

if (typeof window !== "undefined" && unlocked()) {
  if (new URLSearchParams(window.location.search).get("preview") !== KEY) {
    const next = stamp(window.location.pathname + window.location.search + window.location.hash);
    history.replaceState(history.state, "", next);
  }

  const push = history.pushState.bind(history);
  const replace = history.replaceState.bind(history);
  history.pushState = (state, title, url) => {
    if (typeof url === "string") url = stamp(url);
    return push(state, title, url);
  };
  history.replaceState = (state, title, url) => {
    if (typeof url === "string") url = stamp(url);
    return replace(state, title, url);
  };

  const scan = (root: ParentNode) => {
    root.querySelectorAll("a[href]").forEach(el => fixAnchor(el as HTMLAnchorElement));
  };

  const start = () => {
    scan(document);
    const obs = new MutationObserver(records => {
      for (const record of records) {
        record.addedNodes.forEach(node => {
          if (node instanceof HTMLAnchorElement) fixAnchor(node);
          else if (node instanceof Element) scan(node);
        });
        if (record.type === "attributes" && record.target instanceof HTMLAnchorElement) {
          fixAnchor(record.target);
        }
      }
    });
    obs.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });
  };

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);

  document.addEventListener(
    "click",
    event => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const a = target.closest("a");
      if (a instanceof HTMLAnchorElement) fixAnchor(a);
    },
    true,
  );
}
