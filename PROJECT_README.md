# Wet Kitty Coastal Storefront

Premium coastal and biker lifestyle apparel storefront. Printful supplies the live catalog and fulfills paid orders; Stripe Checkout securely collects payment and shipping information.

## Local setup

Requirements: Node.js 22+, pnpm, a Printful store, and a Stripe account.

1. Copy `.env.example` to `.env.local` and add the private server credentials.
2. Install dependencies with `pnpm install`.
3. Run `pnpm dev` and open `http://localhost:3000`.

## Commerce flow

1. The server reads synced products, variants, retail prices, and mockup images from Printful.
2. Cart contents are stored in a signed token. Prices are always reloaded from Printful on the server.
3. Checkout creates a Stripe-hosted payment page with the verified prices and shipping charge.
4. Stripe sends `checkout.session.completed` to `/api/webhooks/stripe`.
5. The server verifies Stripe's signature and payment status, then submits the order to Printful with `confirm=true`.

The browser never receives the Printful token, Stripe secret key, webhook secret, or cart-signing secret.

## Required server settings

```text
PUBLIC_SITE_URL=https://wetkittycoastal.com
PRINTFUL_API_TOKEN=...
PRINTFUL_STORE_ID=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
CART_SIGNING_SECRET=...
```

Optional launch settings:

```text
STRIPE_FLAT_SHIPPING_CENTS=599
STRIPE_FREE_SHIPPING_THRESHOLD_CENTS=10000
STRIPE_AUTOMATIC_TAX=false
```

Turn on `STRIPE_AUTOMATIC_TAX` only after Stripe Tax is activated and the required registrations have been configured.

## Printful token

Create a private token in Printful's Developer Portal. It needs store-product read access and order read/write access. A store-level token is simplest. If using an account-level token, also set `PRINTFUL_STORE_ID`.

The products must be fully synced in the selected Printful store and must have retail prices and mockup images.

## Stripe webhook

Create a webhook endpoint for:

```text
https://wetkittycoastal.com/api/webhooks/stripe
```

Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`, then save its signing secret as `STRIPE_WEBHOOK_SECRET`.

## Commands

- `pnpm dev` — development server
- `pnpm build` — production build
- `pnpm start` — production server
- `pnpm check` — TypeScript check
- `pnpm test` — tests

## Important launch test

Use Stripe test mode first. Complete one full test checkout and confirm that a draft/confirmed order appears in Printful with the correct item, size, address, and retail total. After switching to live Stripe keys and the live webhook secret, place one low-value live order before advertising the store.
