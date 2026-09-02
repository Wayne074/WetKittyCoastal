# Wet Kitty launch notes

## Completed

- Homepage navigation and overlapping-button corrections.
- Men's Collection and Shop Tees, Tanks & Hoodies links.
- Working collection, product-detail, cart, return-policy, and checkout-success routes.
- Rewards removed for launch.
- Shopify storefront code removed.
- Printful live catalog adapter added.
- Tamper-resistant server-validated cart added.
- Stripe-hosted Checkout added with payment and shipping collection.
- Verified Stripe webhook added to send paid orders to Printful automatically.
- Free shipping at $100 and $5.99 standard shipping below $100 are the current defaults.

## Account connection still required

1. Add the Printful token and store ID to the live host.
2. Add the Stripe secret key to the live host.
3. Create the Stripe webhook and add its signing secret to the live host.
4. Confirm Printful products have mockups, variants, retail prices, and are fully synced.
5. Complete one Stripe test order and one low-value live order.

Do not accept live orders until the end-to-end test reaches Printful successfully.
