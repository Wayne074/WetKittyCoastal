import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import express, { type Express, type Request, type Response } from "express";
import { TRPCError } from "@trpc/server";
import type { Cart } from "@shared/commerce/types";
import { createPrintfulOrder } from "./printful";

const STRIPE_API = "https://api.stripe.com/v1";

type StripeAddress = {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
};

type StripeSession = {
  id: string;
  url?: string | null;
  payment_status?: "paid" | "unpaid" | "no_payment_required";
  customer_details?: {
    email?: string | null;
    phone?: string | null;
    name?: string | null;
  } | null;
  shipping_details?: {
    name?: string | null;
    address?: StripeAddress | null;
  } | null;
  collected_information?: {
    shipping_details?: {
      name?: string | null;
      address?: StripeAddress | null;
    } | null;
  } | null;
  line_items?: {
    data?: Array<{
      quantity?: number | null;
      amount_total?: number | null;
      price?: {
        unit_amount?: number | null;
        product?: { metadata?: Record<string, string> } | string | null;
      } | null;
    }>;
  } | null;
};

type StripeEvent = {
  id: string;
  type: string;
  data: { object: StripeSession };
};

function stripeSecret() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Stripe checkout is not connected yet.",
    });
  }
  return key;
}

function cents(value: string) {
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "A product has an invalid retail price.",
    });
  }
  return Math.round(amount * 100);
}

async function stripeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${STRIPE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${stripeSecret()}`,
      ...(init?.headers ?? {}),
    },
  });
  const json = (await response.json().catch(() => null)) as
    | (T & { error?: { message?: string } })
    | null;
  if (!response.ok || !json) {
    console.error(
      "[Stripe]",
      path,
      response.status,
      json?.error?.message ?? "Invalid response"
    );
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Stripe could not start checkout.",
    });
  }
  return json;
}

function checkoutOrigin(requestedOrigin: string) {
  const configured = process.env.PUBLIC_SITE_URL?.trim();
  const candidate = configured || requestedOrigin;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The checkout return address is invalid.",
    });
  }

  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const isWetKitty =
    url.hostname === "wetkittycoastal.com" ||
    url.hostname === "www.wetkittycoastal.com";
  const isPreview = url.hostname.endsWith(".manus.space");
  if (
    (!isLocal && url.protocol !== "https:") ||
    (!configured && !isLocal && !isWetKitty && !isPreview)
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The checkout return address is not allowed.",
    });
  }
  return url.origin;
}

function addShippingOption(params: URLSearchParams, subtotal: number) {
  const flatRate = Number.parseInt(
    process.env.STRIPE_FLAT_SHIPPING_CENTS || "599",
    10
  );
  const freeThreshold = Number.parseInt(
    process.env.STRIPE_FREE_SHIPPING_THRESHOLD_CENTS || "10000",
    10
  );
  const shippingAmount = subtotal >= freeThreshold ? 0 : Math.max(0, flatRate);
  params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  params.set(
    "shipping_options[0][shipping_rate_data][fixed_amount][amount]",
    String(shippingAmount)
  );
  params.set(
    "shipping_options[0][shipping_rate_data][fixed_amount][currency]",
    "usd"
  );
  params.set(
    "shipping_options[0][shipping_rate_data][display_name]",
    shippingAmount === 0 ? "Free standard shipping" : "Standard shipping"
  );
  params.set(
    "shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]",
    "business_day"
  );
  params.set(
    "shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]",
    "5"
  );
  params.set(
    "shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]",
    "business_day"
  );
  params.set(
    "shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]",
    "12"
  );
}

export async function createCheckoutSession(
  cart: Cart,
  requestedOrigin: string
) {
  if (!cart.items.length)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Your cart is empty.",
    });
  const origin = checkoutOrigin(requestedOrigin);
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set(
    "success_url",
    `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  );
  params.set("cancel_url", `${origin}/cart?checkout=canceled`);
  params.set("customer_creation", "always");
  params.set("payment_method_types[0]", "card");
  params.set("phone_number_collection[enabled]", "true");
  params.set("shipping_address_collection[allowed_countries][0]", "US");
  params.set("submit_type", "pay");
  params.set("client_reference_id", `wet-kitty-${randomUUID()}`);
  params.set("metadata[store]", "wet-kitty-coastal");
  params.set("allow_promotion_codes", "true");

  if (process.env.STRIPE_AUTOMATIC_TAX === "true") {
    params.set("automatic_tax[enabled]", "true");
  }

  let subtotal = 0;
  cart.items.forEach((item, index) => {
    const unitAmount = cents(item.unitPrice.amount);
    subtotal += unitAmount * item.quantity;
    params.set(
      `line_items[${index}][price_data][currency]`,
      item.unitPrice.currencyCode.toLowerCase()
    );
    params.set(
      `line_items[${index}][price_data][unit_amount]`,
      String(unitAmount)
    );
    params.set(
      `line_items[${index}][price_data][product_data][name]`,
      `${item.productTitle} — ${item.variantTitle}`
    );
    params.set(
      `line_items[${index}][price_data][product_data][metadata][printful_variant_id]`,
      item.variantId
    );
    if (item.image?.url?.startsWith("https://")) {
      params.set(
        `line_items[${index}][price_data][product_data][images][0]`,
        item.image.url
      );
    }
    params.set(`line_items[${index}][quantity]`, String(item.quantity));
  });
  addShippingOption(params, subtotal);

  const session = await stripeFetch<StripeSession>("/checkout/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!session.url)
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Stripe did not return a checkout link.",
    });
  return { url: session.url };
}

function parseStripeSignature(header: string) {
  const values = header.split(",").map(part => part.trim().split("=", 2));
  const timestamp = values.find(([key]) => key === "t")?.[1];
  const signatures = values
    .filter(([key]) => key === "v1")
    .map(([, value]) => value);
  return { timestamp, signatures };
}

export function verifyStripeWebhook(rawBody: Buffer, signatureHeader: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is missing");
  const { timestamp, signatures } = parseStripeSignature(signatureHeader);
  if (!timestamp || !signatures.length)
    throw new Error("Malformed Stripe signature");
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > 300)
    throw new Error("Expired Stripe signature");
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.`)
    .update(rawBody)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const valid = signatures.some(signature => {
    const provided = Buffer.from(signature);
    return (
      provided.length === expectedBuffer.length &&
      timingSafeEqual(provided, expectedBuffer)
    );
  });
  if (!valid) throw new Error("Invalid Stripe signature");
  return JSON.parse(rawBody.toString("utf8")) as StripeEvent;
}

async function retrieveCheckoutSession(id: string) {
  const params = new URLSearchParams();
  params.append("expand[]", "line_items.data.price.product");
  return stripeFetch<StripeSession>(
    `/checkout/sessions/${encodeURIComponent(id)}?${params}`
  );
}

async function fulfillPaidSession(sessionId: string) {
  const session = await retrieveCheckoutSession(sessionId);
  if (session.payment_status !== "paid") return;
  const shipping =
    session.collected_information?.shipping_details || session.shipping_details;
  const address = shipping?.address;
  const email = session.customer_details?.email;
  if (
    !shipping?.name ||
    !address?.line1 ||
    !address.city ||
    !address.country ||
    !address.postal_code ||
    !email
  ) {
    throw new Error(
      `Stripe session ${session.id} is missing fulfillment details`
    );
  }

  const items = (session.line_items?.data ?? []).map(line => {
    const product =
      typeof line.price?.product === "object" ? line.price.product : null;
    const variantId = product?.metadata?.printful_variant_id;
    if (!variantId || !line.quantity)
      throw new Error(`Stripe session ${session.id} has an invalid line item`);
    const unitAmount =
      line.price?.unit_amount ??
      (line.amount_total && line.quantity
        ? Math.round(line.amount_total / line.quantity)
        : null);
    return {
      variantId,
      quantity: line.quantity,
      retailPrice: unitAmount ? (unitAmount / 100).toFixed(2) : undefined,
    };
  });
  if (!items.length)
    throw new Error(`Stripe session ${session.id} has no line items`);

  await createPrintfulOrder({
    stripeSessionId: session.id,
    recipient: {
      name: shipping.name,
      email,
      phone: session.customer_details?.phone,
      address1: address.line1,
      address2: address.line2,
      city: address.city,
      stateCode: address.state,
      countryCode: address.country,
      zip: address.postal_code,
    },
    items,
  });
}

async function stripeWebhook(req: Request, res: Response) {
  const signature = req.header("stripe-signature");
  if (!signature || !Buffer.isBuffer(req.body))
    return res.status(400).send("Invalid webhook request");

  let event: StripeEvent;
  try {
    event = verifyStripeWebhook(req.body, signature);
  } catch (error) {
    console.error("[Stripe webhook] signature rejected", error);
    return res.status(400).send("Invalid signature");
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await fulfillPaidSession(event.data.object.id);
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Stripe webhook] fulfillment failed", event.id, error);
    return res.status(500).json({ received: false });
  }
}

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json", limit: "1mb" }),
    stripeWebhook
  );
}
