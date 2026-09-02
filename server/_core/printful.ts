import { createHmac, timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import type {
  Cart,
  Collection,
  Image,
  Product,
  ProductVariant,
} from "@shared/commerce/types";

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

const COLLECTIONS: Collection[] = [
  {
    id: "men",
    handle: "men",
    title: "Men's Collection",
    description: "Tees, hoodies, hats, and coastal biker gear.",
    image: null,
  },
  {
    id: "women",
    handle: "women",
    title: "Low Tide",
    description: "Women's coastal and biker apparel.",
    image: null,
  },
  {
    id: "hats",
    handle: "hats",
    title: "Pier 7",
    description: "Hats, caps, and embroidered headwear.",
    image: null,
  },
  {
    id: "hoodies",
    handle: "hoodies",
    title: "Salt Run",
    description: "Hoodies and sweatshirts for cooler nights.",
    image: null,
  },
  {
    id: "beach",
    handle: "beach",
    title: "High Tide",
    description: "Tanks, towels, shorts, and beach-ready gear.",
    image: null,
  },
  {
    id: "limited-drop",
    handle: "limited-drop",
    title: "Last Call",
    description: "Limited-run Wet Kitty releases.",
    image: null,
  },
];

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
      message: "The Printful catalog is not connected yet.",
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
      message: "Printful could not complete that request.",
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

function imageFromVariant(
  variant: SyncVariant,
  fallback?: string | null
): Image | null {
  const preview =
    variant.files?.find(file => file.type === "preview") ?? variant.files?.[0];
  const url =
    preview?.preview_url ||
    preview?.thumbnail_url ||
    preview?.url ||
    variant.product?.image ||
    fallback;
  return url ? { url, altText: variant.name || null } : null;
}

function productTags(productName: string, variants: SyncVariant[]) {
  const text =
    `${productName} ${variants.map(v => `${v.name} ${v.product?.name ?? ""}`).join(" ")}`.toLowerCase();
  const tags = new Set<string>(["apparel"]);
  const explicitlyMen = /\b(men|men's|mens|male)\b/.test(text);
  const explicitlyWomen = /\b(women|women's|womens|ladies|female)\b/.test(text);

  if (!explicitlyWomen || /\bunisex\b/.test(text)) tags.add("men");
  if (!explicitlyMen || /\bunisex\b/.test(text)) tags.add("women");
  if (/\b(hat|cap|snapback|trucker|beanie|visor)\b/.test(text))
    tags.add("hats");
  if (/\b(hoodie|sweatshirt|fleece|pullover)\b/.test(text)) tags.add("hoodies");
  if (
    /\b(beach|tank|towel|swim|shorts|board short|rash guard|bikini)\b/.test(
      text
    )
  )
    tags.add("beach");
  if (/\b(limited|last call|drop|numbered)\b/.test(text))
    tags.add("limited-drop");
  return Array.from(tags);
}

function normalizeVariant(raw: SyncVariant): ProductVariant {
  const selectedOptions = (raw.options ?? [])
    .filter(option => option.value)
    .map(option => ({ name: option.id || "Option", value: option.value! }));

  if (!selectedOptions.length) {
    selectedOptions.push({
      name: "Style",
      value: raw.product?.variant_name || raw.name || "Standard",
    });
  }

  return {
    id: String(raw.id),
    title: raw.product?.variant_name || raw.name,
    price: { amount: raw.retail_price, currencyCode: raw.currency || "USD" },
    compareAtPrice: null,
    availableForSale: raw.synced !== false,
    selectedOptions,
  };
}

function normalizeProduct(detail: SyncProductDetail): Product {
  const variants = detail.sync_variants
    .filter(v => v.synced !== false)
    .map(normalizeVariant);
  const prices = variants
    .map(v => Number.parseFloat(v.price.amount))
    .filter(Number.isFinite);
  const currency = variants[0]?.price.currencyCode || "USD";
  const images = detail.sync_variants
    .map(variant =>
      imageFromVariant(variant, detail.sync_product.thumbnail_url)
    )
    .filter((image): image is Image => Boolean(image))
    .filter(
      (image, index, all) =>
        all.findIndex(other => other.url === image.url) === index
    );
  const handle = `${slugify(detail.sync_product.name)}-${detail.sync_product.id}`;

  return {
    id: String(detail.sync_product.id),
    handle,
    title: detail.sync_product.name,
    description: "Made to order by Printful for Wet Kitty Coastal.",
    descriptionHtml: "<p>Made to order by Printful for Wet Kitty Coastal.</p>",
    productType:
      productTags(detail.sync_product.name, detail.sync_variants).find(
        tag => tag !== "apparel"
      ) ?? "Apparel",
    vendor: "Wet Kitty Coastal",
    tags: productTags(detail.sync_product.name, detail.sync_variants),
    images,
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
    options: [],
    variants,
  };
}

async function fetchCatalog(): Promise<Product[]> {
  if (catalogCache && catalogCache.expiresAt > Date.now())
    return catalogCache.products;

  const summaries = await printfulFetch<SyncProductSummary[]>(
    "/store/products?limit=100"
  );
  const active = summaries.filter(product => product.synced !== 0);
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

  catalogCache = { expiresAt: Date.now() + CATALOG_CACHE_MS, products };
  return products;
}

export async function listProducts(
  options: { first?: number; collectionHandle?: string } = {}
) {
  const products = await fetchCatalog();
  const filtered = options.collectionHandle
    ? products.filter(product =>
        product.tags.includes(options.collectionHandle!)
      )
    : products;
  return filtered.slice(0, options.first ?? 24);
}

export async function getProductByHandle(handle: string) {
  const product = (await fetchCatalog()).find(item => item.handle === handle);
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
    const image = product.images[0] ?? null;
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

export async function createPrintfulOrder(input: {
  stripeSessionId: string;
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
    `${PRINTFUL_API}/orders/@${encodeURIComponent(input.stripeSessionId)}`,
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
      message: "Printful could not verify the order.",
    });
  }

  const body = {
    external_id: input.stripeSessionId,
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
  };

  return printfulFetch<unknown>("/orders?confirm=true&update_existing=true", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
