import { useState } from "react";
import { Link } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { SHOP_OPEN } from "@/const";
import { trpc } from "@/lib/trpc";
import type { Product } from "@shared/commerce/types";
import { SHOP_SECTIONS } from "@shared/commerce/sections";

/**
 * Approved Wet Kitty homepage artwork with functional navigation overlays.
 * The artwork remains the visual source of truth; this layer supplies the
 * clickable controls, corrected hero eyebrow text, cart, and mobile menu.
 */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, itemCount, loading, proceedToCheckout } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main className="wk-approved-home" aria-label="Wet Kitty Coastal homepage">

      {!SHOP_OPEN && (
        <div className="wk-open-soon-banner" role="status">
          <strong>Opening Soon</strong>
          <span>
            We&apos;re dialing in the products &amp; graphics — salt, chrome, and good times incoming.
          </span>
          <Link href="/founding-crew" className="wk-open-soon-cta">Join Founding Crew</Link>
        </div>
      )}
      <img
        className="wk-approved-art"
        src="/home-assets/wet-kitty-homepage-final.webp"
        alt="Wet Kitty Coastal — premium beach and biker lifestyle apparel"
      />

      {/* Correct the misspelled wording baked into the approved artwork. */}
      <div className="wk-eyebrow-fix" aria-label="Premium Coastal Biker Lifestyle">
        <span className="wk-eyebrow-premium">PREMIUM</span>
        <span>COASTAL&nbsp; • &nbsp;BIKER LIFESTYLE</span>
      </div>

      {/* Opaque mask covers the navigation and icons baked into the artwork. */}
      <div className="wk-header-mask" aria-hidden="true" />

      {/* Functional header overlay. */}
      <nav className="wk-top-nav" aria-label="Main navigation">
        {!SHOP_OPEN && <Link href="/">Home</Link>}
        {SHOP_OPEN ? (
          <>
            <Link href="/collections/apparel">Shop All</Link>
            {SHOP_SECTIONS.map(section => (
              <Link key={section.handle} href={`/collections/${section.handle}`}>
                {section.navLabel}
              </Link>
            ))}
            <Link href="/founding-crew">Founding Crew</Link>
            <Link href="/community">About</Link>
          </>
        ) : (
          <>
            <Link href="/founding-crew">Founding Crew</Link>
            <Link href="/community">About</Link>
          </>
        )}
      </nav>

      <div className="wk-header-actions" aria-label="Store actions">
        {SHOP_OPEN && (
          <button
            type="button"
            aria-label={`Open shopping cart${itemCount ? `, ${itemCount} items` : ""}`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag aria-hidden="true" />
            {itemCount > 0 && <span className="wk-cart-count">{itemCount}</span>}
          </button>
        )}
        <button type="button" aria-label="Open navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          <Menu aria-hidden="true" />
        </button>
      </div>

      {SHOP_OPEN && (
        <>
          {/* Make the single hero button in the approved artwork functional. */}
          <Hotspot href="/collections/apparel" label="Shop tees, tanks, and hoodies" x={39.5} y={25.2} w={20.5} h={2.75} />

          {/* Collection cards — each maps to one balanced shop section. */}
          <Hotspot href="/collections/coastal-ride" label="High Tide — Coastal & Ride Tees" x={1.3} y={34.8} w={18.7} h={14.1} />
          <Hotspot href="/collections/club" label="Sunset Riders — The Club Collection" x={20.7} y={34.8} w={18.7} h={14.1} />
          <Hotspot href="/collections/accessories" label="Pier 7 — Hats, Stickers & Accessories" x={40.1} y={34.8} w={18.7} h={14.1} />
          <Hotspot href="/collections/hoodies" label="Salt Run — Hoodies & Zips" x={59.6} y={34.8} w={18.7} h={14.1} />
          <Hotspot href="/collections/women" label="Low Tide — Women's Collection" x={79.0} y={34.8} w={19.0} h={14.1} />

          {/* Replace the subtitles baked into the artwork with the real sections. */}
          <CardCaption x={1.6} w={18.8}>Coastal &amp; Ride Tees</CardCaption>
          <CardCaption x={21.4} w={18.7}>The Club Collection</CardCaption>
          <CardCaption x={60.5} w={18.4}>Hoodies &amp; Zips</CardCaption>

          {/* Live Printful products cover the retired "best sellers" artwork. */}
          <NewDrop />
        </>
      )}

      <Hotspot href="/" label="Wet Kitty Coastal home" x={2.5} y={0.9} w={23} h={3} />

      {/* Newsletter remains routed to the working community signup for now. */}
      <Hotspot href="/community" label="Join the Crew" x={45.0} y={84.4} w={31.0} h={3.4} />

      {/* Working footer links from the approved artwork. */}
      {SHOP_OPEN && (
        <>
          <Hotspot href="/collections/apparel" label="Footer: Men" x={29.8} y={93.4} w={7.2} h={1.15} />
          <Hotspot href="/collections/women" label="Footer: Women" x={29.8} y={94.45} w={7.2} h={1.15} />
          <Hotspot href="/collections/apparel" label="Footer: Collections" x={29.8} y={95.5} w={9.5} h={1.15} />
          <Hotspot href="/collections/coastal-ride" label="Footer: Beach" x={29.8} y={96.55} w={7.2} h={1.15} />
          <Hotspot href="/collections/accessories" label="Footer: Accessories" x={29.8} y={98.65} w={10.5} h={1.15} />
        </>
      )}
      <Hotspot href="/founding-crew" label="Footer: Founding Crew" x={29.8} y={97.6} w={7.2} h={1.15} />
      <Hotspot href="/community" label="Footer: About Us" x={44.2} y={93.4} w={9.2} h={1.15} />
      <Hotspot href="/community" label="Footer: Our Story" x={44.2} y={94.45} w={9.2} h={1.15} />
      <Hotspot href="/founding-crew" label="Footer: Founding Crew" x={44.2} y={95.5} w={7.2} h={1.15} />
      <Hotspot href="/community" label="Footer: Community" x={44.2} y={96.55} w={10.2} h={1.15} />
      <Hotspot href="/community" label="Footer: Contact" x={44.2} y={98.65} w={8.0} h={1.15} />
      <Hotspot href="/returns" label="Footer: Shipping" x={58.8} y={94.45} w={8.2} h={1.15} />
      <Hotspot href="/returns" label="Footer: Returns" x={58.8} y={95.5} w={8.2} h={1.15} />

      {menuOpen && (
        <div className="wk-panel-backdrop" role="presentation" onClick={() => setMenuOpen(false)}>
          <aside className="wk-side-panel" aria-label="Navigation menu" onClick={event => event.stopPropagation()}>
            <button className="wk-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
            <h2>Explore Wet Kitty</h2>
            {SHOP_OPEN ? (
              <>
                <PanelLink href="/collections/apparel" onClick={() => setMenuOpen(false)}>Shop All</PanelLink>
                {SHOP_SECTIONS.map(section => (
                  <PanelLink key={section.handle} href={`/collections/${section.handle}`} onClick={() => setMenuOpen(false)}>
                    {section.subtitle}
                  </PanelLink>
                ))}
              </>
            ) : (
              <p className="wk-open-soon-note">Shop Opening Soon — products &amp; graphics cooking.</p>
            )}
            <PanelLink href="/founding-crew" onClick={() => setMenuOpen(false)}>Founding Crew</PanelLink>
            <PanelLink href="/community" onClick={() => setMenuOpen(false)}>About / Join the Crew</PanelLink>
            <PanelLink href="/" onClick={() => setMenuOpen(false)}>Home</PanelLink>
          </aside>
        </div>
      )}


      {SHOP_OPEN && cartOpen && (
        <div className="wk-panel-backdrop" role="presentation" onClick={() => setCartOpen(false)}>
          <aside className="wk-side-panel" aria-label="Shopping cart" onClick={event => event.stopPropagation()}>
            <button className="wk-close" onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button>
            <h2>Your Cart</h2>
            {loading ? (
              <p>Loading cart…</p>
            ) : !cart || itemCount === 0 ? (
              <>
                <p>Your cart is empty.</p>
                <PanelLink href="/collections/apparel" onClick={() => setCartOpen(false)}>Start shopping</PanelLink>
              </>
            ) : (
              <>
                <p><strong>{itemCount}</strong> item{itemCount === 1 ? "" : "s"} in your cart.</p>
                <div className="wk-cart-lines">
                  {cart.items.map(line => (
                    <div key={line.lineId} className="wk-cart-line">
                      <span>{line.productTitle}</span>
                      <span>Qty {line.quantity}</span>
                    </div>
                  ))}
                </div>
                <button className="wk-checkout" onClick={proceedToCheckout}>Proceed to checkout</button>
              </>
            )}
          </aside>
        </div>
      )}

      <style>{`
        .wk-approved-home { container-type: inline-size; position: relative; width: 100%; max-width: 1600px; margin: 0 auto; background: #f4eee3; line-height: 0; overflow: hidden; }
        .wk-approved-art { display: block; width: 100%; height: auto; user-select: none; -webkit-user-drag: none; }
        .wk-hotspot { position: absolute; z-index: 4; display: block; border: 0; border-radius: 4px; line-height: normal; color: transparent; background: transparent; outline-offset: 2px; cursor: pointer; }
        .wk-hotspot:focus-visible, .wk-top-nav a:focus-visible, .wk-header-actions button:focus-visible { outline: 2px solid #49d3cf; outline-offset: 2px; }
        .wk-hotspot[data-area="nav"] { border-radius: 0; }
        @media (hover: hover) {
          .wk-hotspot:hover { background: rgba(73, 211, 207, 0.10); box-shadow: inset 0 0 0 1px rgba(73, 211, 207, 0.35); }
          .wk-top-nav a:hover { color: #49d3cf; border-color: rgba(73,211,207,.75); }
          .wk-header-actions button:hover { color: #49d3cf; background: rgba(73,211,207,.12); }
        }

        .wk-header-mask { position: absolute; z-index: 10; left: 28.2%; top: .55%; width: 69.8%; height: 3.35%; background: #071417; border-radius: 3px; }
        .wk-top-nav { position: absolute; z-index: 12; left: 28.2%; top: .86%; width: 54.3%; height: 2.75%; display: flex; align-items: center; justify-content: space-between; gap: .15%; padding: 0 .45%; border-radius: 3px; background: #071417; line-height: 1; }
        .wk-top-nav a { display: flex; align-items: center; justify-content: center; height: 72%; padding: 0 .5vw; border: 1px solid transparent; border-radius: 3px; color: #f6efe4; text-decoration: none; white-space: nowrap; font: 700 clamp(5px, .64vw, 11px)/1 Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
        .wk-header-actions { position: absolute; z-index: 13; left: 83.3%; top: .86%; width: 13.7%; height: 2.75%; display: flex; align-items: center; justify-content: space-around; padding: 0 .25%; border-radius: 3px; background: #071417; line-height: 1; }
        .wk-header-actions button { position: relative; display: grid; place-items: center; width: 29%; height: 80%; padding: 0; border: 0; border-radius: 4px; color: #f6efe4; background: transparent; cursor: pointer; }
        .wk-header-actions svg { width: 62%; height: 62%; stroke-width: 1.8; }
        .wk-cart-count { position: absolute; top: -8%; right: 3%; min-width: 13px; height: 13px; display: grid; place-items: center; padding: 0 3px; border-radius: 999px; color: #071417; background: #49d3cf; font: 800 8px/1 Arial, sans-serif; }
        .wk-eyebrow-fix { position: absolute; z-index: 3; left: 28.7%; top: 8.02%; width: 43.8%; height: 2.45%; display: flex; gap: .72em; align-items: center; justify-content: center; box-sizing: border-box; padding: 0 .8%; line-height: 1; color: #f2eadf; font: 600 clamp(7px, 1.05vw, 17px)/1 Arial, sans-serif; letter-spacing: .19em; white-space: nowrap; text-shadow: 0 1px 4px rgba(0,0,0,.8); background: rgba(8,18,19,.92); }
        .wk-eyebrow-premium { color: #33c3c1; }
        .wk-panel-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,.58); line-height: 1.45; }
        .wk-side-panel { position: absolute; top: 0; right: 0; width: min(390px, 88vw); height: 100%; overflow-y: auto; padding: 76px 28px 32px; color: #f7f0e5; background: #071417; box-shadow: -12px 0 34px rgba(0,0,0,.4); }
        .wk-side-panel h2 { margin: 0 0 24px; font: 700 30px/1.15 Georgia, serif; }
        .wk-side-panel p { color: rgba(247,240,229,.72); font-size: 16px; }
        .wk-close { position: absolute; top: 20px; right: 20px; display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.18); border-radius: 50%; color: white; background: transparent; cursor: pointer; }
        .wk-panel-link { display: block; margin: 4px 0; padding: 14px 12px; border-bottom: 1px solid rgba(255,255,255,.10); color: #f7f0e5; text-decoration: none; font: 700 15px/1.2 Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
        .wk-panel-link:hover { color: #49d3cf; }
        .wk-cart-lines { margin: 18px 0; border-top: 1px solid rgba(255,255,255,.12); }
        .wk-cart-line { display: flex; justify-content: space-between; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.12); color: #f7f0e5; font-size: 14px; }
        .wk-checkout { width: 100%; margin-top: 18px; padding: 15px 18px; border: 0; border-radius: 8px; background: #37bbb9; color: #061416; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; cursor: pointer; }
        @media (max-width: 700px) { .wk-eyebrow-fix { font-size: 6px; letter-spacing: .12em; } .wk-top-nav a { font-size: 4.2px; padding: 0 .15vw; } }

        .wk-card-caption { position: absolute; z-index: 5; top: 45.8%; height: 1.4%; display: flex; align-items: center; justify-content: center; pointer-events: none; background: linear-gradient(90deg, rgba(11,17,19,.55) 0%, rgba(11,17,19,.97) 5%, rgba(11,17,19,.97) 95%, rgba(11,17,19,.55) 100%); color: #f2ece2; font: 600 1.02cqw/1 Arial, sans-serif; letter-spacing: .09em; text-transform: uppercase; white-space: nowrap; border-radius: 2px; }
        .wk-newdrop { position: absolute; z-index: 5; left: 0; top: 53.85%; width: 100%; height: 19.3%; box-sizing: border-box; padding: 0 1.3% ; background: #f2ece2; line-height: 1.2; display: flex; flex-direction: column; }
        .wk-newdrop-head { display: flex; align-items: center; justify-content: center; gap: 2cqw; height: 3.4cqw; }
        .wk-newdrop-head h2 { margin: 0; color: #0b1113; font: 700 1.75cqw/1 Georgia, 'Times New Roman', serif; letter-spacing: .16em; text-transform: uppercase; }
        .wk-newdrop-head a { color: #177f7d; font: 700 1.05cqw/1 Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; }
        .wk-newdrop-head a:hover { text-decoration: underline; }
        .wk-newdrop-grid { flex: 1; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1.1cqw; padding-top: .8cqw; min-height: 0; }
        .wk-newdrop-card { display: flex; flex-direction: column; min-height: 0; color: #0b1113; text-decoration: none; }
        .wk-newdrop-img { flex: 1; min-height: 0; align-self: center; aspect-ratio: 4 / 5; max-width: 100%; display: grid; place-items: center; overflow: hidden; border-radius: .9cqw; background: #fff; box-shadow: 0 .3cqw 1.4cqw rgba(7,16,20,.08), 0 .1cqw .3cqw rgba(7,16,20,.04); }
        .wk-newdrop-img img { width: 100%; height: 100%; object-fit: contain; transition: transform .5s ease; }
        .wk-newdrop-card:hover .wk-newdrop-img img { transform: scale(1.04); }
        .wk-newdrop-title { margin-top: .7cqw; font: 700 1.05cqw/1.2 Arial, sans-serif; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wk-newdrop-price { margin-top: .3cqw; margin-bottom: .6cqw; font: 600 1cqw/1 Arial, sans-serif; text-align: center; color: #3b4447; }
        .wk-newdrop-empty { flex: 1; display: grid; place-items: center; color: #3b4447; font: 600 1.2cqw/1.3 Arial, sans-serif; }

        .wk-open-soon-banner {
          position: relative; z-index: 20; display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
          gap: 10px 18px; padding: 12px 16px; line-height: 1.35; text-align: center;
          color: #061416; background: linear-gradient(90deg, #37bbb9 0%, #49d3cf 50%, #7ad4cd 100%);
          font: 600 14px/1.35 Arial, sans-serif;
        }
        .wk-open-soon-banner strong { font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
        .wk-open-soon-cta {
          display: inline-block; padding: 6px 12px; border-radius: 6px; background: #061416; color: #49d3cf;
          text-decoration: none; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; font-size: 12px;
        }
        .wk-open-soon-cta:hover { color: #f7f0e5; }
        .wk-open-soon-note { margin: 0 0 16px; color: rgba(247,240,229,.72); font-size: 15px; line-height: 1.45; }
      `}</style>
    </main>
  );
}

function Hotspot({ href, label, x, y, w, h, area }: { href: string; label: string; x: number; y: number; w: number; h: number; area?: string }) {
  return (
    <Link href={href} className="wk-hotspot" aria-label={label} data-area={area} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
      {label}
    </Link>
  );
}

function PanelLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return <Link href={href} className="wk-panel-link" onClick={onClick}>{children}</Link>;
}

function CardCaption({ x, w, children }: { x: number; w: number; children: React.ReactNode }) {
  return (
    <span className="wk-card-caption" aria-hidden="true" style={{ left: `${x}%`, width: `${w}%` }}>
      {children}
    </span>
  );
}

/**
 * The homepage row mirrors the first six of the Shop All "Featured" order
 * (the server already returns products in that order), so the homepage and
 * the shop open with the same six real garment mockups.
 */
function pickFeatured(products: Product[]) {
  return products.filter(product => product.images.length).slice(0, 6);
}

function formatPrice(amount: string) {
  const value = Number.parseFloat(amount);
  return Number.isFinite(value) ? `$${value.toFixed(2)}` : "";
}

function NewDrop() {
  const { data: products = [], isLoading } = trpc.commerce.products.list.useQuery({ first: 100 });
  const featured = pickFeatured(products);
  return (
    <section className="wk-newdrop" aria-label="The new drop">
      <div className="wk-newdrop-head">
        <h2>The New Drop</h2>
        <Link href="/collections/apparel">Shop all &rarr;</Link>
      </div>
      {featured.length ? (
        <div className="wk-newdrop-grid">
          {featured.map(product => (
            <Link key={product.id} href={`/products/${product.handle}`} className="wk-newdrop-card">
              <span className="wk-newdrop-img">
                {product.images[0] && <img src={product.images[0].url} alt={product.title} loading="lazy" />}
              </span>
              <span className="wk-newdrop-title">{product.title}</span>
              <span className="wk-newdrop-price">{formatPrice(product.priceRange.min.amount)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="wk-newdrop-empty">{isLoading ? "Loading the new drop…" : "New gear is on the way."}</div>
      )}
    </section>
  );
}
