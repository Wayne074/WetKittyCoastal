# Wet Kitty launch notes

## Completed in this package
- Approved homepage artwork is now the homepage visual source of truth.
- Existing site header and footer are hidden only on the homepage, because both are already included in the approved artwork.
- Navigation, hero buttons, collection cards, wishlist, rallies, product cards, and Join the Crew area have clickable overlays.
- Product-card overlays currently route to live collection pages so visitors do not hit missing product URLs before the Printful catalog is connected.
- Removed unresolved analytics placeholders that caused production-build warnings.

## Still required before accepting real orders
1. Connect the live Printful/commerce catalog and confirm product handles, variants, prices, and images.
2. Configure the payment provider/checkout credentials.
3. Configure shipping, tax, return policy, privacy policy, and terms pages.
4. Test one complete order in sandbox/test mode, then one low-value live order.
5. Replace collection-level product links with exact product-detail links after the real catalog is available.

Do not run automatic dependency upgrades or `npm audit fix --force` immediately before launch. Test dependency changes separately.
