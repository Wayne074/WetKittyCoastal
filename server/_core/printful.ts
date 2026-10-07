import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import type {
  Cart,
  Collection,
  Image,
  Product,
  ProductVariant,
} from "@shared/commerce/types";
import {
  SHOP_SECTIONS,
  classifyProductSection,
  productSections,
} from "@shared/commerce/sections";
import { customerDescription } from "@shared/commerce/copy";
import {
  HOODIE_BACK_ALT,
  MEN_ORDER,
  WOMEN_CUT_ORDER,
  WOMEN_UNISEX_ORDER,
  sortByPreference,
  sortFeatured,
} from "@shared/commerce/featured";

const PRINTFUL_API = "https://api.printful.com";
const CATALOG_CACHE_MS = 5 * 60 * 1000;

type PrintfulResponse<T> = {
  code: number;
  result: T;
  error?: { message?: string };
};

type SyncProductSummary = {
  id: number;
  external_id?: string;
  name: string;
  variants?: number;
  synced?: number;
  thumbnail_url?: string | null;
};

type SyncVariant = {
  id: number;
  external_id?: string;
  name: string;
  synced?: boolean;
  variant_id?: number;
  retail_price: string;
  currency: string;
  files?: Array<{
    type?: string;
    preview_url?: string | null;
    thumbnail_url?: string | null;
    url?: string | null;
  }>;
  options?: Array<{ id?: string; value?: string }>;
  product?: { name?: string; variant_name?: string; image?: string | null };
};

type SyncProductDetail = {
  sync_product: SyncProductSummary;
  sync_variants: SyncVariant[];
};

type CartTokenPayload = {
  v: 1;
  lines: Array<{ variantId: string; quantity: number }>;
};

const COLLECTIONS: Collection[] = SHOP_SECTIONS.map(section => ({
  id: section.handle,
  handle: section.handle,
  title: section.title,
  description: section.description,
  image: null,
}));

let catalogCache: { expiresAt: number; products: Product[] } | null = null;

export function resetPrintfulCatalogCache() {
  catalogCache = null;
}

function getToken() {
  return process.env.PRINTFUL_API_TOKEN?.trim() ?? "";
}

function getStoreId() {
  return process.env.PRINTFUL_STORE_ID?.trim() ?? "";
}

export function isPrintfulConfigured() {
  return Boolean(getToken());
}

function printfulHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
  if (getStoreId()) headers["X-PF-Store-Id"] = getStoreId();
  return headers;
}

async function printfulFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!isPrintfulConfigured()) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "The shop catalog is not connected yet.",
    });
  }

  const response = await fetch(`${PRINTFUL_API}${path}`, {
    ...init,
    headers: { ...printfulHeaders(), ...(init?.headers ?? {}) },
  });
  const body = (await response
    .json()
    .catch(() => null)) as PrintfulResponse<T> | null;
  if (!response.ok || !body || body.code >= 400) {
    const message =
      body?.error?.message || `Printful returned HTTP ${response.status}`;
    console.error("[Printful]", path, response.status, message);
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "The shop could not complete that request.",
    });
  }
  return body.result;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "wet-kitty-product"
  );
}

/**
 * Display-name corrections for Printful products whose store names are
 * generic or carry an internal "(Wet Kitty)" suffix. Keyed by Printful sync
 * product id. Everything else (prices, variants, images) comes from Printful.
 */
const TITLE_OVERRIDES: Record<string, string> = {
  "475065897": "Salty Soul Wild Heart Women’s Raglan Baby Tee",
  "475069001": "Yacht & Rod Club Men’s Tee",
  "475046079": "Sky High Club Tee",
  "475046373": "Race Club Tee",
  "475046677": "Race Club Street Tee",
  "475056771": "Down Low Club Tee",
  "475048215": "Salty Soul Wild Heart Tee",
  "475058494": "Wet Kitty Brand Mark Dad Hat",
  "475058883": "Wet Kitty Brand Mark Sticker",
  "475052995": "Wet Kitty Coastal Highway Women’s Raglan Baby Tee",
};

/**
 * Products whose Printful thumbnail is a second real mockup (the garment
 * front, or the flag/towel in use). It is shown as the second gallery image.
 */
const THUMBNAIL_SECOND = new Set([
  // Coastal Lifestyle tees 475246689 and 475246695 used to inject the sync
  // thumbnail as a second shot. That thumbnail is now a blank front (neck
  // label only). The variant preview is the large back, so it leads alone.
  "475247521", // Paw Skater Dress (back)
  "475246968",
  "475246971",
  "475246973", // flags (on the wall)
  "475246981", // beach towel (at the beach)
]);

function printSide(name: string): "Front" | "Back" | null {
  const match = name.match(/(?:—|–|-)\s*(front|back)\b/i);
  if (!match) return null;
  return match[1].toLowerCase() === "front" ? "Front" : "Back";
}

export function displayTitle(id: string | number, name: string) {
  const side = printSide(name);
  const override = TITLE_OVERRIDES[String(id)];
  let title = override
    ? override
    : name.replace(/\s*\((?:wet kitty(?: coastal)?)\)/gi, " ");
  title = title
    .replace(/\s*(?:—|–|-)\s*(front|back)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (side && !/\b(front|back)\b/i.test(title)) title = `${title} — ${side}`;
  return title || name;
}

const SIZE_TOKENS = new Set([
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
  "ONE SIZE",
]);

function looksLikeSize(value: string) {
  const v = value.trim().toUpperCase();
  return (
    SIZE_TOKENS.has(v) ||
    /\d\s*(?:″|"|in\b|oz\b|×|x\d)/i.test(value) ||
    /\b(?:regular|slim|youth|toddler)\b/i.test(value)
  );
}

/** Split "Product Name / Black / M" into its option parts. */
function variantParts(raw: SyncVariant, productName: string) {
  let label = raw.name || "";
  if (label.startsWith(productName)) label = label.slice(productName.length);
  label = label.replace(/^\s*[-/]\s*/, "");
  const parts = label
    .split(" / ")
    .map(part => part.trim())
    .filter(Boolean);
  return parts;
}

function isAllOverPrint(name: string) {
  return /\b(flag|towel|dress|skirt)\b/i.test(name);
}

function normalizeVariant(
  raw: SyncVariant,
  productName: string,
  fallbackImage: Image | null
): ProductVariant {
  // Printful sometimes returns real color/size options; most store products
  // instead carry embroidery metadata here, which is not customer-facing.
  const printfulOptions = (raw.options ?? [])
    .filter(
      option =>
        typeof option.value === "string" &&
        option.value &&
        /^(color|colour|size)$/i.test(option.id ?? "")
    )
    .map(option => ({ name: option.id!, value: option.value! }));

  const parts = variantParts(raw, productName);
  let selectedOptions = printfulOptions;
  if (!selectedOptions.length) {
    selectedOptions = [];
    let color: string | undefined;
    let size: string | undefined;
    for (const part of parts) {
      if (!size && looksLikeSize(part)) size = part;
      else if (!color) color = part;
    }
    // Single-color products often carry only the size in the sync variant
    // name; the catalog variant name ("Blank (Orange / S)") has the color.
    const catalogParts =
      raw.product?.name
        ?.match(/\(([^()]*)\)\s*$/)?.[1]
        ?.split(" / ")
        .map(part => part.trim())
        .filter(Boolean) ?? [];
    for (const part of catalogParts) {
      if (!size && looksLikeSize(part)) size = part;
      else if (!color && !looksLikeSize(part)) color = part;
    }
    // All-over prints (flags, towels, dresses) report the blank as "White";
    // the real color is the artwork, so use the title's color or none.
    if (isAllOverPrint(productName) && color && /^white$/i.test(color)) {
      color = productName.match(/-\s*([A-Za-z ]+)\s*$/)?.[1]?.trim();
    }
    if (color)
      color = color.replace(/^Solid\s+/i, "").replace(/\s+Blend$/i, "");
    if (color) selectedOptions.push({ name: "Color", value: color });
    if (size) selectedOptions.push({ name: "Size", value: size });
  }
  if (!selectedOptions.length) {
    selectedOptions.push({ name: "Style", value: "Standard" });
  }

  return {
    id: String(raw.id),
    title: parts.join(" / ") || raw.product?.variant_name || "Standard",
    price: { amount: raw.retail_price, currencyCode: raw.currency || "USD" },
    compareAtPrice: null,
    availableForSale: raw.synced !== false,
    selectedOptions,
    image: mockupFromVariant(raw) ?? fallbackImage,
  };
}

function mockupFromVariant(variant: SyncVariant): Image | null {
  const preview = variant.files?.find(file => file.type === "preview");
  const url = preview?.preview_url || preview?.thumbnail_url || null;
  return url ? { url, altText: variant.name || null } : null;
}

/** Duplicate Printful listings kept off the storefront. */
const HIDDEN_PRODUCTS = new Set([
  "475060906", // duplicate Brand Mark hoodie
  "475060583", // duplicate Brand Mark hoodie
]);

function designImagesFromVariant(variant: SyncVariant): Image[] {
  return (variant.files ?? [])
    .filter(file => file.type !== "preview" && !/label/i.test(file.type ?? ""))
    .map((file): Image | null => {
      const url = file.preview_url || file.thumbnail_url || null;
      return url
        ? {
            url,
            altText: /back/i.test(file.type ?? "")
              ? "Back print artwork"
              : "Print artwork",
          }
        : null;
    })
    .filter((image): image is Image => Boolean(image));
}

function uniqueImages(images: Image[]) {
  return images.filter(
    (image, index, all) =>
      all.findIndex(other => other.url === image.url) === index
  );
}

/** Back-print products (their print files are no longer listed by the v1 API). */
const BACK_PRINT_PRODUCTS = new Set([
  "475046079",
  "475046373",
  "475046677",
  "475048215",
  "475056771",
  "475057564",
  "475069001",
  "475069318",
  "475065897",
  "475069764",
  "475070138",
]);

/**
 * Short customer-facing garment description. Deliberately no supplier,
 * brand-of-blank or model-number details.
 */
// Real generated mockups for products whose auto preview shows the blank
// side (back-print items where the store preview is the front).
const PRIMARY_MOCKUP: Record<string, string> = {
  // Salty Soul raglan baby tee: back print
  "475065897":
    "https://files.cdn.printful.com/files/252/2520c105a2ee138c84c3e1a95f209676_preview.png",
};

// Do not inject older blank-front mockups here. Yacht & Rod zip 475069764
// used to, and the card rotator preferred those empty navy/white fronts
// over the live previews that actually show the left-chest mark.
const EXTRA_MOCKUPS: Record<string, { url: string; altText: string }[]> = {};

/**
 * Sync-product thumbnails that are an unprinted front. They are not a back
 * mockup and must not be used as a card or gallery image.
 */
const BLANK_HOODIE_THUMBNAILS = new Set([
  "475246699", // Coastal Lifestyle zip — blank front
  "475246703", // Coastal Lifestyle pullover — blank front
]);

/**
 * Garment-back photos generated for the gallery. Store thumbnails for these
 * products are either a blank front or a raw file host, not the photo to show.
 * Cards still lead with the chest; this shot is the back in the gallery.
 */
const HOODIE_BACK_MOCKUP: Record<string, string> = {
  "475246703": "/images/mockups/coastal-lifestyle-pullover-back.jpg",
  "475246699": "/images/mockups/coastal-lifestyle-zip-back.jpg",
  "475067424": "/images/mockups/wave-apparel-pullover-back.jpg",
  "475066883": "/images/mockups/wave-apparel-zip-back.jpg",
  "475065629": "/images/mockups/brand-mark-pullover-back.jpg",
  "475064976": "/images/mockups/brand-mark-zip-back.jpg",
};

/**
 * Garment-back photos per color for products whose live variant previews
 * are the fronts. Each back is placed right after its color's front in the
 * gallery, so the color picker still lands on the front.
 */
const COLOR_BACK_MOCKUPS: Record<string, Record<string, string>> = {
  // WKC Letterman Jacket: big WKC back graphic
  "478997139": {
    "Jet Black/Arctic White":
      "/images/mockups/wkc-letterman-black-white-back.jpg",
    "Oxford Navy/Heather Grey": "/images/mockups/wkc-letterman-navy-back.jpg",
    "Jet Black/Fire Red": "/images/mockups/wkc-letterman-black-red-back.jpg",
  },
};

/** Alt text for a per-color back shot. Cards skip it so the front leads. */
export function colorBackAlt(color: string) {
  return `Back of the jacket, ${color}`;
}

export function withColorBacks(productId: string, images: Image[]): Image[] {
  const backs = COLOR_BACK_MOCKUPS[productId];
  if (!backs) return images;
  const result: Image[] = [];
  for (const image of images) {
    result.push(image);
    const color = Object.keys(backs).find(name =>
      (image.altText ?? "").includes(` / ${name} / `)
    );
    if (color) result.push({ url: backs[color], altText: colorBackAlt(color) });
  }
  return uniqueImages(result);
}

function isHoodieTitle(title: string) {
  return /\b(hoodie|pullover)\b/i.test(title);
}

/** Print-file previews (front chest art, back art). Not garment photos. */
export function rawPrintUrls(detail: SyncProductDetail) {
  const urls = new Set<string>();
  for (const variant of detail.sync_variants) {
    for (const file of variant.files ?? []) {
      const type = file.type ?? "";
      if (/^preview$/i.test(type) || /label/i.test(type)) continue;
      for (const url of [file.preview_url, file.thumbnail_url, file.url]) {
        if (url) urls.add(url);
      }
    }
  }
  return urls;
}

/**
 * A hoodie back belongs in the gallery only when Printful already has a
 * garment-back mockup (the store thumbnail). A `back` print-file preview is
 * raw artwork and is never returned here. Blank-front thumbnails are not backs.
 */
export function garmentBackUrl(
  productId: string,
  thumbnailUrl: string | null | undefined,
  printUrls: Set<string>
) {
  if (!thumbnailUrl) return null;
  if (BLANK_HOODIE_THUMBNAILS.has(productId)) return null;
  if (printUrls.has(thumbnailUrl)) return null;
  return thumbnailUrl;
}

function hoodieBackShot(
  detail: SyncProductDetail,
  productId: string,
  thumbnail: Image | null
): Image | null {
  const generated = HOODIE_BACK_MOCKUP[productId];
  if (generated) return { url: generated, altText: HOODIE_BACK_ALT };
  const url = garmentBackUrl(productId, thumbnail?.url, rawPrintUrls(detail));
  return url ? { url, altText: HOODIE_BACK_ALT } : null;
}

function normalizeProduct(detail: SyncProductDetail): Product {
  const title = displayTitle(detail.sync_product.id, detail.sync_product.name);
  const synced = detail.sync_variants.filter(v => v.synced !== false);
  const thumbnail: Image | null = detail.sync_product.thumbnail_url
    ? { url: detail.sync_product.thumbnail_url, altText: title }
    : null;

  const primary = PRIMARY_MOCKUP[String(detail.sync_product.id)];
  const mockups = uniqueImages([
    ...(primary ? [{ url: primary, altText: title }] : []),
    ...synced
      .map(mockupFromVariant)
      .filter((image): image is Image => Boolean(image)),
  ]);
  const designs = uniqueImages(synced.flatMap(designImagesFromVariant));
  const productId = String(detail.sync_product.id);
  // Apparel always leads with the garment; raw print artwork is only ever a
  // secondary detail image at the end of the gallery.
  // Only fall back to the product thumbnail / raw print files when there are
  // no live garment previews: those can be stale (an old placement) or a
  // mostly transparent placement canvas.
  const leadImages =
    thumbnail && mockups.length && THUMBNAIL_SECOND.has(productId)
      ? [mockups[0], thumbnail, ...mockups.slice(1)]
      : mockups;
  const extras = EXTRA_MOCKUPS[String(detail.sync_product.id)] ?? [];
  const backShot = isHoodieTitle(title)
    ? hoodieBackShot(detail, productId, thumbnail)
    : null;
  const printUrls = isHoodieTitle(title) ? rawPrintUrls(detail) : null;
  const images = uniqueImages(
    mockups.length
      ? [
          ...leadImages.slice(0, 1),
          ...extras.slice(0, 1),
          ...leadImages.slice(1),
          ...extras.slice(1),
          ...(backShot ? [backShot] : []),
        ]
      : [
          ...(thumbnail && !BLANK_HOODIE_THUMBNAILS.has(productId)
            ? [thumbnail]
            : []),
          ...designs,
          ...(backShot ? [backShot] : []),
        ]
  )
    .filter(image => !printUrls?.has(image.url))
    .map(image => ({ ...image, altText: image.altText || title }));
  const gallery = withColorBacks(productId, images);

  const variants = synced.map(v => {
    const variant = normalizeVariant(
      v,
      detail.sync_product.name,
      mockups[0] ?? thumbnail
    );
    return variant;
  });
  const backPrint =
    BACK_PRINT_PRODUCTS.has(productId) ||
    (!isAllOverPrint(title) &&
      synced.some(v =>
        (v.files ?? []).some(file => /^back/i.test(file.type ?? ""))
      ));
  const prices = variants
    .map(v => Number.parseFloat(v.price.amount))
    .filter(Number.isFinite);
  const currency = variants[0]?.price.currencyCode || "USD";
  const handle = `${slugify(title)}-${detail.sync_product.id}`;
  const section = classifyProductSection(title);

  const optionNames: string[] = [];
  for (const v of variants)
    for (const o of v.selectedOptions)
      if (!optionNames.includes(o.name)) optionNames.push(o.name);
  const options = optionNames
    .map(name => ({
      name,
      values: Array.from(
        new Set(
          variants
            .map(v => v.selectedOptions.find(o => o.name === name)?.value)
            .filter((value): value is string => Boolean(value))
        )
      ),
    }))
    .filter(option => option.values.length > 0);

  const description = customerDescription({
    title,
    backPrint,
    womensCut: section === "women",
  });

  return {
    id: String(detail.sync_product.id),
    handle,
    title,
    description,
    descriptionHtml: `<p>${description.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!)}</p>`,
    productType: section,
    vendor: "Wet Kitty Coastal",
    tags: productSections(title),
    images: gallery,
    priceRange: {
      min: {
        amount: prices.length ? Math.min(...prices).toFixed(2) : "0.00",
        currencyCode: currency,
      },
      max: {
        amount: prices.length ? Math.max(...prices).toFixed(2) : "0.00",
        currencyCode: currency,
      },
    },
    options,
    variants,
  };
}

/**
 * All-over-print products have a single blank colour in Printful, so each
 * background colour is its own sync product. These groups merge them into one
 * storefront card with a Color picker (variant ids stay the real Printful sync
 * variant ids, so cart and checkout are unchanged). First member leads.
 */
const COLOR_GROUPS: Array<{ title: string; members: Array<[string, string]> }> =
  [
    {
      title: "Wet Kitty Paw Skater Dress",
      members: [
        ["475247521", "Black"],
        ["475247534", "White"],
        ["475247551", "Pink"],
      ],
    },
  ];

function mergeColorGroups(products: Product[]) {
  let result = products;
  for (const group of COLOR_GROUPS) {
    const members = group.members
      .map(([id, color]) => ({
        color,
        product: result.find(product => product.id === id),
      }))
      .filter((member): member is { color: string; product: Product } =>
        Boolean(member.product)
      );
    if (!members.length) continue;
    const lead = members[0].product;
    const variants = members.flatMap(({ color, product }) =>
      product.variants.map(variant => {
        const rest = variant.selectedOptions.filter(
          option => !/^colou?r$/i.test(option.name)
        );
        return {
          ...variant,
          title: [color, ...rest.map(option => option.value)].join(" / "),
          selectedOptions: [{ name: "Color", value: color }, ...rest],
        };
      })
    );
    const optionNames = Array.from(
      new Set(variants.flatMap(v => v.selectedOptions.map(o => o.name)))
    );
    const prices = variants
      .map(v => Number.parseFloat(v.price.amount))
      .filter(Number.isFinite);
    const currency = lead.priceRange.min.currencyCode;
    const merged: Product = {
      ...lead,
      title: group.title,
      handle: `${slugify(group.title)}-${lead.id}`,
      images: uniqueImages([
        ...members.map(({ product }) => product.images[0]).filter(Boolean),
        ...members.flatMap(({ product }) => product.images.slice(1)),
      ]),
      variants,
      options: optionNames.map(name => ({
        name,
        values: Array.from(
          new Set(
            variants
              .map(v => v.selectedOptions.find(o => o.name === name)?.value)
              .filter((value): value is string => Boolean(value))
          )
        ),
      })),
      priceRange: {
        min: { amount: Math.min(...prices).toFixed(2), currencyCode: currency },
        max: { amount: Math.max(...prices).toFixed(2), currencyCode: currency },
      },
    };
    const memberIds = new Set(members.map(({ product }) => product.id));
    result = result
      .map(product => (product.id === lead.id ? merged : product))
      .filter(product => product.id === lead.id || !memberIds.has(product.id));
  }
  return result;
}

/**
 * Printful occasionally ends up with the same product created twice (same
 * name). Show only the newest copy so the storefront never lists identical
 * cards side by side.
 */
function dedupeByTitle(products: Product[]) {
  const newest = new Map<string, Product>();
  for (const product of products) {
    const key = product.title.toLowerCase();
    const current = newest.get(key);
    if (!current || Number(product.id) > Number(current.id))
      newest.set(key, product);
  }
  return products.filter(
    product => newest.get(product.title.toLowerCase()) === product
  );
}

async function fetchCatalog(): Promise<Product[]> {
  if (catalogCache && catalogCache.expiresAt > Date.now())
    return catalogCache.products;

  const summaries = await printfulFetch<SyncProductSummary[]>(
    "/store/products?limit=100"
  );
  const active = summaries.filter(
    product => product.synced !== 0 && !HIDDEN_PRODUCTS.has(String(product.id))
  );
  const products: Product[] = [];

  for (let index = 0; index < active.length; index += 5) {
    const batch = active.slice(index, index + 5);
    const details = await Promise.all(
      batch.map(product =>
        printfulFetch<SyncProductDetail>(`/store/products/${product.id}`)
      )
    );
    products.push(
      ...details
        .map(normalizeProduct)
        .filter(product => product.variants.length > 0)
    );
  }

  const unique = sortFeatured(dedupeByTitle(mergeColorGroups(products)));
  catalogCache = { expiresAt: Date.now() + CATALOG_CACHE_MS, products: unique };
  return unique;
}

export async function listProducts(
  options: { first?: number; collectionHandle?: string } = {}
) {
  const products = await fetchCatalog();
  const handle = options.collectionHandle;
  let filtered =
    handle && handle !== "apparel"
      ? products.filter(product => product.tags.includes(handle))
      : products;
  // Women's Club: her cuts first, then unisex tees in a beach-and-night
  // order that is not the Men's Club order.
  if (handle === "women") {
    const cut = filtered.filter(product => product.productType === "women");
    const rest = filtered.filter(product => product.productType !== "women");
    filtered = [
      ...sortByPreference(cut, WOMEN_CUT_ORDER),
      ...sortByPreference(rest, WOMEN_UNISEX_ORDER),
    ];
  }
  // Men's Club: boats, cars, and bikes before the rest.
  if (handle === "men") filtered = sortByPreference(filtered, MEN_ORDER);
  return filtered.slice(0, options.first ?? 100);
}

export async function getProductByHandle(handle: string) {
  const catalog = await fetchCatalog();
  // Accept older handles (pre-rename) by matching the trailing Printful id.
  const id = handle.match(/-(\d+)$/)?.[1];
  const product =
    catalog.find(item => item.handle === handle) ??
    (id ? catalog.find(item => item.id === id) : undefined);
  if (!product)
    throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
  return product;
}

export async function listCollections(first = 10) {
  return COLLECTIONS.slice(0, first);
}

export async function getCollectionByHandle(handle: string) {
  const collection = COLLECTIONS.find(item => item.handle === handle);
  if (!collection)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Collection not found.",
    });
  return collection;
}

function cartSigningSecret() {
  const secret =
    process.env.CART_SIGNING_SECRET ||
    process.env.JWT_SECRET ||
    process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Checkout security is not configured yet.",
    });
  }
  return secret;
}

function sign(encoded: string) {
  return createHmac("sha256", cartSigningSecret())
    .update(encoded)
    .digest("base64url");
}

function encodeCart(payload: CartTokenPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function decodeCart(token: string): CartTokenPayload {
  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) throw new Error("Malformed cart");
  const expectedSignature = sign(encoded);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  )
    throw new Error("Invalid cart signature");
  const payload = JSON.parse(
    Buffer.from(encoded, "base64url").toString("utf8")
  ) as CartTokenPayload;
  if (payload.v !== 1 || !Array.isArray(payload.lines))
    throw new Error("Unsupported cart");
  return payload;
}

export async function resolveCart(cartId: string): Promise<Cart | null> {
  let payload: CartTokenPayload;
  try {
    payload = decodeCart(cartId);
  } catch {
    return null;
  }

  const products = await fetchCatalog();
  const items = payload.lines.map(line => {
    const product = products.find(item =>
      item.variants.some(variant => variant.id === line.variantId)
    );
    const variant = product?.variants.find(item => item.id === line.variantId);
    if (!product || !variant || !variant.availableForSale) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "A cart item is no longer available.",
      });
    }
    const image = variant.image ?? product.images[0] ?? null;
    const unit = Number.parseFloat(variant.price.amount);
    return {
      lineId: line.variantId,
      variantId: line.variantId,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: variant.title,
      image,
      unitPrice: variant.price,
      quantity: line.quantity,
      lineTotal: {
        amount: (unit * line.quantity).toFixed(2),
        currencyCode: variant.price.currencyCode,
      },
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + Number.parseFloat(item.lineTotal.amount),
    0
  );
  const currencyCode = items[0]?.unitPrice.currencyCode || "USD";
  return {
    id: cartId,
    checkoutUrl: "",
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: { amount: subtotal.toFixed(2), currencyCode },
    total: { amount: subtotal.toFixed(2), currencyCode },
  };
}

function normalizeLines(lines: Array<{ variantId: string; quantity: number }>) {
  const quantities = new Map<string, number>();
  for (const line of lines) {
    quantities.set(
      line.variantId,
      Math.min(99, (quantities.get(line.variantId) ?? 0) + line.quantity)
    );
  }
  return Array.from(quantities.entries()).map(([variantId, quantity]) => ({
    variantId,
    quantity,
  }));
}

async function cartFromLines(
  lines: Array<{ variantId: string; quantity: number }>
) {
  const clean = normalizeLines(lines).filter(line => line.quantity > 0);
  const token = encodeCart({ v: 1, lines: clean });
  return resolveCart(token) as Promise<Cart>;
}

export function createCart(
  lines: Array<{ variantId: string; quantity: number }>
) {
  return cartFromLines(lines);
}

export function getCart(cartId: string) {
  return resolveCart(cartId);
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ variantId: string; quantity: number }>
) {
  const current = decodeCart(cartId);
  return cartFromLines([...current.lines, ...lines]);
}

export async function updateCartLines(
  cartId: string,
  updates: Array<{ lineId: string; quantity: number }>
) {
  const current = decodeCart(cartId);
  const updateMap = new Map(
    updates.map(update => [update.lineId, update.quantity])
  );
  return cartFromLines(
    current.lines.map(line => ({
      ...line,
      quantity: updateMap.has(line.variantId)
        ? updateMap.get(line.variantId)!
        : line.quantity,
    }))
  );
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const current = decodeCart(cartId);
  const removals = new Set(lineIds);
  return cartFromLines(
    current.lines.filter(line => !removals.has(line.variantId))
  );
}

/** Live confirmation stays off unless PRINTFUL_LIVE_FULFILLMENT is exactly "true".
 *  A Stripe test-mode payment (livemode false) can never confirm. */
export function printfulOrderConfirm(stripeLivemode: boolean): boolean {
  if (stripeLivemode !== true) return false;
  return process.env.PRINTFUL_LIVE_FULFILLMENT === "true";
}

/** Printful external ids are limited to 32 characters. The hash is stable, so a Stripe retry finds the same draft. */
export function printfulExternalId(stripeSessionId: string) {
  return `wk${createHash("sha256").update(stripeSessionId).digest("hex").slice(0, 30)}`;
}

export function buildPrintfulOrder(input: {
  stripeSessionId: string;
  stripeLivemode: boolean;
  recipient: {
    name: string;
    email: string;
    phone?: string | null;
    address1: string;
    address2?: string | null;
    city: string;
    stateCode?: string | null;
    countryCode: string;
    zip: string;
  };
  items: Array<{ variantId: string; quantity: number; retailPrice?: string }>;
}) {
  const confirm = printfulOrderConfirm(input.stripeLivemode);
  return {
    path: `/orders?confirm=${confirm ? "true" : "false"}&update_existing=true`,
    body: {
      external_id: printfulExternalId(input.stripeSessionId),
      shipping: "STANDARD",
      recipient: {
        name: input.recipient.name,
        email: input.recipient.email,
        phone: input.recipient.phone || undefined,
        address1: input.recipient.address1,
        address2: input.recipient.address2 || undefined,
        city: input.recipient.city,
        state_code: input.recipient.stateCode || undefined,
        country_code: input.recipient.countryCode,
        zip: input.recipient.zip,
      },
      items: input.items.map(item => ({
        sync_variant_id: Number(item.variantId),
        quantity: item.quantity,
        retail_price: item.retailPrice,
      })),
    },
  };
}

export async function createPrintfulOrder(input: {
  stripeSessionId: string;
  stripeLivemode: boolean;
  recipient: {
    name: string;
    email: string;
    phone?: string | null;
    address1: string;
    address2?: string | null;
    city: string;
    stateCode?: string | null;
    countryCode: string;
    zip: string;
  };
  items: Array<{ variantId: string; quantity: number; retailPrice?: string }>;
}) {
  // Stripe retries webhooks. Treat an existing Printful order with the same
  // external id as success so a retry can never create a duplicate shipment.
  const existingResponse = await fetch(
    `${PRINTFUL_API}/orders/@${encodeURIComponent(printfulExternalId(input.stripeSessionId))}`,
    { headers: printfulHeaders() }
  );
  if (existingResponse.ok) {
    const existing = (await existingResponse
      .json()
      .catch(() => null)) as PrintfulResponse<unknown> | null;
    if (existing?.result) return existing.result;
  } else if (existingResponse.status !== 404) {
    console.error("[Printful] order lookup failed", existingResponse.status);
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "The order could not be verified.",
    });
  }

  const order = buildPrintfulOrder(input);

  return printfulFetch<unknown>(order.path, {
    method: "POST",
    body: JSON.stringify(order.body),
  });
}
