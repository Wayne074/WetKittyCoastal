# Wet Kitty Coastal: shirt color expansion audit

Generated 2026-10-05 23:40 CT. Source: plan.json, results.json, raw/after_*.json, apply.log.

## Totals

- Products in plan: 35; products touched: 35
- New sync variants added: 1284 (includes 10 duplicate sync variants on 476306462, so 1274 unique new color/size combos; see Problems)
- Existing variants unchanged in all products: yes; existing prices unchanged: yes
- New variants: artwork files only (no label_inside/label_outside), same retail price per size as the product's existing variants. Variant 5525181233 untouched. No hoodies/hats/stickers touched. No orders, no Stripe.

## Colors added by blank type

| Blank | Products | Variants added | Colors added (number of products) |
|---|---|---|---|
| Gildan 64000 unisex tee (catalog 12) | 22 | 960 | Light Blue 20, Sand 20, Daisy 18, Coral Silk 18, Heliconia 18, Tropical Blue 14, Navy 14, Sapphire 14, White 10, Natural 6, Orange 4, Black 4 |
| Gildan 64000L women's tee (849) | 6 | 140 | Azalea 6, Red 6, Irish Green 6, Royal 4, RS Sport Grey 4, White 2 |
| Bella+Canvas 1201 raglan baby tee / "Babydoll" (967) | 6 | 154 | White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red (6 each; White/Red has no size S) |
| Bella+Canvas 1012 crop tank (780) | 1 | 30 | Solid White Blend, Solid Baby Blue Blend, Solid Pink Blend, Solid Navy Blend, Athletic Heather |

Unisex tees were filled up to 10 colors in the preference order Black, White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire, Orange, Natural, Cornsilk, Jade Dome, Sport Grey, Royal. Colors flagged for low artwork contrast were skipped. Women's tees, raglans and the tank received the full in-stock palette.

## Flagged for contrast (not added)

| Design (Front + Back products) | Color | Reason |
|---|---|---|
| Yacht & Rod Club Men's Tee | Light Blue, Sport Grey, Natural, Cornsilk | chrome/silver WET KITTY lettering washes out on pale shirts |
| Wet Kitty Wave Apparel Tee | Sapphire | blue outer badge ring merges into the shirt |
| Salty Soul Wild Heart Tee | Tropical Blue, Jade Dome | teal WET KITTY headline merges into the shirt |
| Salty Soul Wild Heart Tee | Coral Silk | orange BEACH LIFE tagline disappears |
| Race Club Tee | Coral Silk, Orange | coral/pink lettering and sunset merge into the shirt |
| Sky High Club Tee | Daisy, Cornsilk | yellow lettering merges into the shirt |
| Sky High Club Tee | Orange | orange glow/sunset merges into the shirt |

Unavailable: none (every planned color was in the catalog with at least one in-stock US size). Out of stock: White/Red size S on all 6 raglan/babydoll products, so that size was not created.

## Mockups

- Right after the apply (raw/after_*.json): 1,134 of 1,284 new variants already had a `preview` file. The other 150 were still generating, spread across all products.
- A read-only refetch of all 35 products (raw/now_*.json, 2026-10-05 ~23:35 CT) shows all 1,284 new variants with a `preview` file (preview_url + thumbnail_url).
- Each color has its own preview URL. No preview is shared across colors.
- The refetch also re-confirmed that every pre-existing sync variant has the same catalog variant and retail price as in backup/.
- Details: mockups.json.

## Code files changed

None. The site already maps each sync variant's `preview` file to its variant image (`server/_core/printful.ts` `mockupFromVariant`), and the product page switches the main image on color change. The only uncommitted files in the repo are the pre-existing `client/src/pages/Home.tsx` and `client/src/components/Header.tsx`, which were not touched. Nothing committed, pushed or deployed. SHOP_PUBLIC stays false. No Stripe, no Printful orders, draft 178777581 untouched, no neck-label changes.

## Problems / notes

- **10 duplicate sync variants on Wet Kitty Brand Mark Babydoll — Back (476306462).** The product got 34 new sync variants, but 24 were planned. Ten color/size combos exist twice, with identical catalog variant, price ($34.00) and artwork:
  - White/Navy M, L, XL, 2XL
  - White /True Royal S, M, L, XL, 2XL
  - White/Red M
- How it happened: the first apply run died on a DNS failure, and run 2 hit 429s on this product's `/variants` POSTs. The earlier set (5556063036, 5556063037, 5556063048, 5556063051, 5556063062, 5556063068, 5556063088, 5556063097, 5556063108, 5556063113) is missing from the logs. The logged run-2 set (5556089631, 5556089689, 5556089690, 5556089691, 5556089692, 5556089725, 5556089726, 5556089728, 5556089770, 5556089837) duplicates it. The run's VERIFY step did not check for duplicates.
- Effect: 1,284 sync variants were created, which is 1,274 unique new color/size combos. On the site the duplicates are harmless, because the picker shows one option and the cart uses the first match (the 5556063xxx id). They still clutter Printful.
- Suggested fix (needs your OK; **not done**): delete the 10 run-2 ids listed above from Printful. No other product has duplicates.
- No problems on the other 34 products.
- Cosmetic: the raglan color name "White /True Royal" is Printful's catalog spelling, with a stray space, and appears as-is on the site. A display-name normalization in printful.ts would fix it; not done here.
- Crop tank colors display as White / Baby Blue / Pink / Navy, because the site strips "Solid … Blend".


## Local site verification

Local server `http://127.0.0.1:3000/` (already running, tsx `server/_core/index.ts`, started Oct 2) with `?preview=wkcrew26`. The server catalog cache lasts 5 min (`CATALOG_CACHE_MS`), so it had already reloaded from Printful after the apply. No restart or code change was needed. Headless Chrome (`/usr/bin/google-chrome`, puppeteer-core) script: `site/verify2.cjs`; raw output: `site/verify_out.json`. Add to Cart was clicked, but the `commerce.cart.create` request was intercepted and aborted, so no cart or order was created.

| Page | New color + size | Color shown as option | Cart variantId (captured = expected) | Price (new = existing same size) | Main image switched to that color's mockup |
|---|---|---|---|---|---|
| Down Low Club Tee — Front (476302132, men's Gildan 64000) | Light Blue / L | yes (10 colors) | 5556034617 = 5556034617 (Light Blue / L) | $34.00 = $34.00 | yes |
| Down Low Club Tee — Front, 390px phone | Light Blue / M | yes | 5556034595 = 5556034595 (Light Blue / M) | $34.00 = $34.00 | yes |
| Coastal Lifestyle Women's Tee — Front (476310836, Gildan 64000L) | Azalea / M | yes (8 colors) | 5556037575 = 5556037575 (Azalea / M) | $34.00 = $34.00 | yes |
| Brand Mark Babydoll — Front (475067704, B+C 1201 raglan) | White/Baby Blue / M | yes (6 colors) | 5556205219 = 5556205219 (White/Baby Blue / M) | $34.00 = $34.00 | yes |

Catalog-wide check against the API response (`commerce.products.list`, saved to `site/list.json`):
- All 35 products are listed with their new colors.
- All 1,780 sync variants on these products have their own Printful preview as the variant image. That image is in the product gallery, so selecting the color switches the main image. 0 mismatches.
- Every site price equals the Printful retail_price. 0 mismatches.

Cosmetic notes:
- The raglan/babydoll color "White /True Royal" shows Printful's catalog spelling, with a stray space.
- Crop tank "Solid … Blend" colors show as White / Baby Blue / Pink / Navy, because the existing normalizer strips "Solid" and "Blend".

Code files changed: none. Phone screenshot: `/workspace/wk-home-review/color-product-390.png` (+ `.jpg`), Down Low Club Tee — Front in Light Blue / M.


## Wet Kitty Coastal Lifestyle Women's Tee — Front (`476310836`)

| Field | Value |
|---|---|
| Colors before | Black, White, Navy |
| Colors added | Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Colors after (site) | Black, White, Navy, Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 25 (planned 25) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (15 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 25/25 now (21/25 right after apply) |

## Wet Kitty Coastal Lifestyle Tee — Front (`476309361`)

| Field | Value |
|---|---|
| Colors before | Black, White, Navy, Sapphire, Sand |
| Colors added | Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue |
| Colors after (site) | Black, White, Navy, Sapphire, Sand, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 30 (planned 30) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (30 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 30/30 now (26/30 right after apply) |

## Yacht & Rod Club Women’s Tee (Wet Kitty) — Front (`476308480`)

| Field | Value |
|---|---|
| Colors before | Black, Navy, Royal, RS Sport Grey, White |
| Colors added | Azalea, Red, Irish Green |
| Colors after (site) | Black, Navy, Royal, RS Sport Grey, White, Azalea, Red, Irish Green |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 15 (planned 15) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (25 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 15/15 now (6/15 right after apply) |

## Yacht & Rod Club Men’s Tee — Front (`476307026`)

| Field | Value |
|---|---|
| Colors before | Black, Navy, Sapphire, Tropical Blue |
| Colors added | White, Daisy, Coral Silk, Heliconia, Sand, Orange |
| Colors after (site) | Black, Navy, Sapphire, Tropical Blue, White, Daisy, Coral Silk, Heliconia, Sand, Orange |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | Light Blue: silver/chrome WET KITTY lettering washes out on pale blue; Natural: chrome lettering low contrast on cream; Cornsilk: chrome lettering low contrast on pale yellow; Sport Grey: chrome lettering washes out on light grey |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (31/36 right after apply) |

## Wet Kitty Brand Mark Babydoll — Back (`476306462`)

| Field | Value |
|---|---|
| Colors before | White/Black |
| Colors added | White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red (no S: out of stock) |
| Colors after (site) | White/Black, White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 34 (planned 24) — **10 duplicate sync variants** |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | size out of stock: White/Red S |
| Existing variants unchanged | yes (5 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 34/34 now (31/34 right after apply) |

## Salty Soul Wild Heart Women’s Raglan Baby Tee — Front (`476306159`)

| Field | Value |
|---|---|
| Colors before | White/Black |
| Colors added | White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red (no S: out of stock) |
| Colors after (site) | White/Black, White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 24 (planned 24) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | size out of stock: White/Red S |
| Existing variants unchanged | yes (5 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 24/24 now (17/24 right after apply) |

## Wet Kitty Wave Apparel Women’s Tee — Back (`476305115`)

| Field | Value |
|---|---|
| Colors before | Black, Navy |
| Colors added | White, Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Colors after (site) | Black, Navy, White, Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 30 (planned 30) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (10 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 30/30 now (26/30 right after apply) |

## Wet Kitty Wave Apparel Tee — Back (`476303842`)

| Field | Value |
|---|---|
| Colors before | Black, Navy |
| Colors added | White, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Orange |
| Colors after (site) | Black, Navy, White, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Orange |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 48 (planned 48) |
| Flagged for contrast (not added) | Sapphire: blue outer badge ring merges into sapphire shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (12 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 48/48 now (43/48 right after apply) |

## Wet Kitty Wave Bike Tee — Front (`476302437`)

| Field | Value |
|---|---|
| Colors before | Black, Tropical Blue, Daisy, White |
| Colors added | Navy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | Black, Tropical Blue, Daisy, White, Navy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (35/36 right after apply) |

## Down Low Club Tee — Front (`476302132`)

| Field | Value |
|---|---|
| Colors before | White |
| Colors added | Black, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | White, Black, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (46/54 right after apply) |

## Wet Kitty Coastal Highway Women’s Raglan Baby Tee — Back (`476301524`)

| Field | Value |
|---|---|
| Colors before | White/Black |
| Colors added | White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red (no S: out of stock) |
| Colors after (site) | White/Black, White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 24 (planned 24) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | size out of stock: White/Red S |
| Existing variants unchanged | yes (5 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 24/24 now (20/24 right after apply) |

## Salty Soul Wild Heart Tee — Front (`476301010`)

| Field | Value |
|---|---|
| Colors before | Orange |
| Colors added | Black, White, Navy, Daisy, Heliconia, Light Blue, Sand, Sapphire, Natural |
| Colors after (site) | Orange, Black, White, Navy, Daisy, Heliconia, Light Blue, Sand, Sapphire, Natural |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | Tropical Blue: teal WET KITTY headline merges into teal shirt; Coral Silk: orange BEACH LIFE tagline disappears on coral; Jade Dome: teal headline merges into jade shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (49/54 right after apply) |

## Wet Kitty Brand Mark Tee — Back (`476300285`)

| Field | Value |
|---|---|
| Colors before | Black |
| Colors added | White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | Black, White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (51/54 right after apply) |

## Race Club Street Tee — Front (`476298400`)

| Field | Value |
|---|---|
| Colors before | Black, Navy, Orange, White |
| Colors added | Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand |
| Colors after (site) | Black, Navy, Orange, White, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (32/36 right after apply) |

## Race Club Tee — Front (`476296287`)

| Field | Value |
|---|---|
| Colors before | Black, Heliconia, Tropical Blue, White |
| Colors added | Navy, Daisy, Light Blue, Sand, Sapphire, Natural |
| Colors after (site) | Black, Heliconia, Tropical Blue, White, Navy, Daisy, Light Blue, Sand, Sapphire, Natural |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | Coral Silk: coral/pink WET KITTY gradient and sunset merge into coral shirt; Orange: sunset and coral lettering merge into orange shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (31/36 right after apply) |

## Sky High Club Tee — Front (`476295516`)

| Field | Value |
|---|---|
| Colors before | Black, Heliconia, White |
| Colors added | Navy, Tropical Blue, Coral Silk, Light Blue, Sand, Sapphire, Natural |
| Colors after (site) | Black, Heliconia, White, Navy, Tropical Blue, Coral Silk, Light Blue, Sand, Sapphire, Natural |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 42 (planned 42) |
| Flagged for contrast (not added) | Daisy: yellow top of WET KITTY lettering merges into yellow shirt; Orange: orange glow/sunset merges into orange shirt; Cornsilk: yellow lettering merges into pale yellow shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (18 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 42/42 now (35/42 right after apply) |

## Wet Kitty Coastal Highway Tee — Back (`476294587`)

| Field | Value |
|---|---|
| Colors before | Black |
| Colors added | White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | Black, White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (53/54 right after apply) |

## Wet Kitty Coastal Lifestyle Women's Tee — Back (`475246695`)

| Field | Value |
|---|---|
| Colors before | Black, White, Navy |
| Colors added | Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Colors after (site) | Black, White, Navy, Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 25 (planned 25) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (15 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 25/25 now (20/25 right after apply) |

## Wet Kitty Coastal Lifestyle Tee — Back (`475246689`)

| Field | Value |
|---|---|
| Colors before | Black, White, Navy, Sapphire, Sand |
| Colors added | Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue |
| Colors after (site) | Black, White, Navy, Sapphire, Sand, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 30 (planned 30) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (30 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 30/30 now (24/30 right after apply) |

## Yacht & Rod Club Women’s Tee (Wet Kitty) — Back (`475069318`)

| Field | Value |
|---|---|
| Colors before | Black, Navy, Royal, RS Sport Grey, White |
| Colors added | Azalea, Red, Irish Green |
| Colors after (site) | Black, Navy, Royal, RS Sport Grey, White, Azalea, Red, Irish Green |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 15 (planned 15) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (25 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 15/15 now (14/15 right after apply) |

## Yacht & Rod Club Men’s Tee — Back (`475069001`)

| Field | Value |
|---|---|
| Colors before | Black, Navy, Sapphire, Tropical Blue |
| Colors added | White, Daisy, Coral Silk, Heliconia, Sand, Orange |
| Colors after (site) | Black, Navy, Sapphire, Tropical Blue, White, Daisy, Coral Silk, Heliconia, Sand, Orange |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | Light Blue: silver/chrome WET KITTY lettering washes out on pale blue; Natural: chrome lettering low contrast on cream; Cornsilk: chrome lettering low contrast on pale yellow; Sport Grey: chrome lettering washes out on light grey |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (33/36 right after apply) |

## Wet Kitty Brand Mark Babydoll — Front (`475067704`)

| Field | Value |
|---|---|
| Colors before | White/Black |
| Colors added | White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red (no S: out of stock) |
| Colors after (site) | White/Black, White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 24 (planned 24) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | size out of stock: White/Red S |
| Existing variants unchanged | yes (5 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 24/24 now (23/24 right after apply) |

## Salty Soul Wild Heart Women’s Raglan Baby Tee — Back (`475065897`)

| Field | Value |
|---|---|
| Colors before | White/Black |
| Colors added | White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red (no S: out of stock) |
| Colors after (site) | White/Black, White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 24 (planned 24) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | size out of stock: White/Red S |
| Existing variants unchanged | yes (5 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 24/24 now (19/24 right after apply) |

## Wet Kitty Wave Apparel Women’s Tee — Front (`475061553`)

| Field | Value |
|---|---|
| Colors before | Black, Navy |
| Colors added | White, Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Colors after (site) | Black, Navy, White, Azalea, Royal, RS Sport Grey, Red, Irish Green |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 30 (planned 30) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (10 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 30/30 now (25/30 right after apply) |

## Wet Kitty Wave Apparel Tee — Front (`475061289`)

| Field | Value |
|---|---|
| Colors before | Black, Navy |
| Colors added | White, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Orange |
| Colors after (site) | Black, Navy, White, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Orange |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 48 (planned 48) |
| Flagged for contrast (not added) | Sapphire: blue outer badge ring merges into sapphire shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (12 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 48/48 now (45/48 right after apply) |

## Wet Kitty Wave Bike Tee — Back (`475057564`)

| Field | Value |
|---|---|
| Colors before | Black, Tropical Blue, Daisy, White |
| Colors added | Navy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | Black, Tropical Blue, Daisy, White, Navy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (32/36 right after apply) |

## Down Low Club Tee — Back (`475056771`)

| Field | Value |
|---|---|
| Colors before | White |
| Colors added | Black, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | White, Black, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (51/54 right after apply) |

## Wet Kitty Coastal Highway Women’s Raglan Baby Tee — Front (`475052995`)

| Field | Value |
|---|---|
| Colors before | White/Black |
| Colors added | White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red (no S: out of stock) |
| Colors after (site) | White/Black, White/Baby Blue, White/Pink, White/Navy, White /True Royal, White/Red |
| Sizes / price | S, M, L, XL, 2XL / 34.00 (same per-size retail as existing) |
| Variants added | 24 (planned 24) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | size out of stock: White/Red S |
| Existing variants unchanged | yes (5 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 24/24 now (17/24 right after apply) |

## Wet Kitty Coastal Highway Tee — Front (`475050986`)

| Field | Value |
|---|---|
| Colors before | Black |
| Colors added | White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | Black, White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (53/54 right after apply) |

## Salty Soul Wild Heart Tee — Back (`475048215`)

| Field | Value |
|---|---|
| Colors before | Orange |
| Colors added | Black, White, Navy, Daisy, Heliconia, Light Blue, Sand, Sapphire, Natural |
| Colors after (site) | Orange, Black, White, Navy, Daisy, Heliconia, Light Blue, Sand, Sapphire, Natural |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | Tropical Blue: teal WET KITTY headline merges into teal shirt; Coral Silk: orange BEACH LIFE tagline disappears on coral; Jade Dome: teal headline merges into jade shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (49/54 right after apply) |

## Wet Kitty Brand Mark Crop Tank (`475047937`)

| Field | Value |
|---|---|
| Colors before | Solid Black Blend |
| Colors added | Solid White Blend, Solid Baby Blue Blend, Solid Pink Blend, Solid Navy Blend, Athletic Heather |
| Colors after (site) | Solid Black Blend, Solid White Blend, Solid Baby Blue Blend, Solid Pink Blend, Solid Navy Blend, Athletic Heather |
| Sizes / price | S, XS, M, L, XL, 2XL / 32.00 (same per-size retail as existing) |
| Variants added | 30 (planned 30) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 30/30 now (25/30 right after apply) |

## Wet Kitty Brand Mark Tee — Front (`475047637`)

| Field | Value |
|---|---|
| Colors before | Black |
| Colors added | White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Colors after (site) | Black, White, Navy, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand, Sapphire |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 54 (planned 54) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (6 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 54/54 now (46/54 right after apply) |

## Race Club Street Tee — Back (`475046677`)

| Field | Value |
|---|---|
| Colors before | Black, Navy, Orange, White |
| Colors added | Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand |
| Colors after (site) | Black, Navy, Orange, White, Tropical Blue, Daisy, Coral Silk, Heliconia, Light Blue, Sand |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | none |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (31/36 right after apply) |

## Race Club Tee — Back (`475046373`)

| Field | Value |
|---|---|
| Colors before | Black, Heliconia, Tropical Blue, White |
| Colors added | Navy, Daisy, Light Blue, Sand, Sapphire, Natural |
| Colors after (site) | Black, Heliconia, Tropical Blue, White, Navy, Daisy, Light Blue, Sand, Sapphire, Natural |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 36 (planned 36) |
| Flagged for contrast (not added) | Coral Silk: coral/pink WET KITTY gradient and sunset merge into coral shirt; Orange: sunset and coral lettering merge into orange shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (24 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 36/36 now (35/36 right after apply) |

## Sky High Club Tee — Back (`475046079`)

| Field | Value |
|---|---|
| Colors before | Black, Heliconia, White |
| Colors added | Navy, Tropical Blue, Coral Silk, Light Blue, Sand, Sapphire, Natural |
| Colors after (site) | Black, Heliconia, White, Navy, Tropical Blue, Coral Silk, Light Blue, Sand, Sapphire, Natural |
| Sizes / price | S, M, L, XL, 2XL, 3XL / 34.00 (same per-size retail as existing) |
| Variants added | 42 (planned 42) |
| Flagged for contrast (not added) | Daisy: yellow top of WET KITTY lettering merges into yellow shirt; Orange: orange glow/sunset merges into orange shirt; Cornsilk: yellow lettering merges into pale yellow shirt |
| Unavailable / out of stock | none |
| Existing variants unchanged | yes (18 checked: id, catalog variant, price, name, artwork files, synced) |
| Errors / bad new / price mismatch | 0 / 0 / 0 |
| Mockups (new variants with preview) | 42/42 now (39/42 right after apply) |
