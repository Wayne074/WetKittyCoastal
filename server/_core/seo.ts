/**
 * Crawlability helpers: robots.txt, sitemap.xml, and HTML head injection
 * for Google Search Console verification.
 */
import type { Express, Response } from "express";
import fs from "fs";
import { CUSTOMER_NAV_SECTIONS } from "../../shared/commerce/sections";
import { listProducts } from "./printful";

const SITE = (
  process.env.PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://wetkittycoastal.com"
);

export const DEFAULT_DESCRIPTION =
  "Ride the Tide. Own the Night. Premium beach and biker lifestyle apparel from Panama City Beach. Beach • Biker • Apparel.";

const STATIC_PATHS = [
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/faq",
  "/shipping",
  "/contact",
  "/returns",
  "/community",
  "/collections/apparel",
] as const;

export function siteOrigin() {
  return SITE;
}

export function robotsTxt(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /cart",
    "Disallow: /checkout",
    "Disallow: /wishlist",
    "Disallow: /*?preview=",
    "Disallow: /*&preview=",
    "",
    `Sitemap: ${SITE}/sitemap.xml`,
    "",
  ].join("\n");
}

async function sitemapUrls(): Promise<string[]> {
  const urls = new Set<string>();
  for (const path of STATIC_PATHS) urls.add(`${SITE}${path}`);
  for (const section of CUSTOMER_NAV_SECTIONS) {
    urls.add(`${SITE}/collections/${section.handle}`);
  }
  try {
    const products = await listProducts({ first: 100 });
    for (const product of products) {
      if (product?.handle) urls.add(`${SITE}/products/${product.handle}`);
    }
  } catch (err) {
    console.error("[seo] sitemap product list failed:", err);
  }
  return [...urls];
}

export async function sitemapXml(): Promise<string> {
  const urls = await sitemapUrls();
  const body = urls
    .map(
      loc =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Inject Google Search Console verification meta when GOOGLE_SITE_VERIFICATION
 * is set. Also fills empty content="" placeholders left in index.html.
 */
export function injectHtmlSeo(html: string): string {
  const token = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!token) return html;

  if (/name=["']google-site-verification["']/i.test(html)) {
    return html.replace(
      /(<meta\s+name=["']google-site-verification["']\s+content=["'])[^"']*(["']\s*\/?>)/i,
      `$1${token}$2`
    );
  }

  const tag = `<meta name="google-site-verification" content="${token}" />`;
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
  }
  return `${tag}\n${html}`;
}

/** Express routes that must beat the SPA fallback. */
export function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (_req, res) => {
    res
      .status(200)
      .type("text/plain; charset=utf-8")
      .set("Cache-Control", "public, max-age=3600")
      .send(robotsTxt());
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const xml = await sitemapXml();
      res
        .status(200)
        .type("application/xml; charset=utf-8")
        .set("Cache-Control", "public, max-age=600")
        .send(xml);
    } catch (err) {
      console.error("[seo] sitemap error:", err);
      res.status(500).type("text/plain").send("Sitemap unavailable");
    }
  });
}

/** Read index.html, inject verification meta, and send. */
export function sendIndexHtml(res: Response, filePath: string, status = 200) {
  fs.promises
    .readFile(filePath, "utf-8")
    .then(html => {
      res
        .status(status)
        .type("text/html; charset=utf-8")
        .send(injectHtmlSeo(html));
    })
    .catch(() => {
      res.status(500).type("text/plain").send("index.html missing");
    });
}
