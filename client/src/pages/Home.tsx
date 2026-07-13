import { useState } from "react";
import { Link } from "wouter";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

/**
 * Approved Wet Kitty homepage artwork with functional navigation overlays.
 * The artwork remains the visual source of truth; this layer supplies the
 * clickable controls, corrected hero eyebrow text, cart, and mobile menu.
 */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const { cart, itemCount, loading, proceedToCheckout } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main className="wk-approved-home" aria-label="Wet Kitty Coastal homepage">
      <img
        className="wk-approved-art"
        src="/home-assets/wet-kitty-homepage.png"
        alt="Wet Kitty Coastal — premium beach and biker lifestyle apparel"
      />

      {/* Correct the misspelled wording baked into the approved artwork. */}
      <div className="wk-eyebrow-fix" aria-label="Premium Coastal Biker Lifestyle">
        <span className="wk-eyebrow-premium">PREMIUM</span>
        <span>COASTAL&nbsp; • &nbsp;BIKER LIFESTYLE</span>
      </div>

      {/* Functional header overlay. It covers the baked-in labels/icons so the
          visible text and the clickable targets always match. */}
      <nav className="wk-top-nav" aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/collections/men">Men</Link>
        <Link href="/collections/women">Women</Link>
        <Link href="/collections/men">Collections</Link>
        <Link href="/collections/beach">Beach</Link>
        <Link href="/founding-crew">Founding Crew</Link>
        <Link href="/collections/hats">Accessories</Link>
        <Link href="/community">About</Link>
      </nav>

      <div className="wk-header-actions" aria-label="Store actions">
        <button type="button" aria-label="Open wishlist" onClick={() => setWishlistOpen(true)}>
          <Heart aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Open shopping cart${itemCount ? `, ${itemCount} items` : ""}`}
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag aria-hidden="true" />
          {itemCount > 0 && <span className="wk-cart-count">{itemCount}</span>}
        </button>
        <button type="button" aria-label="Open navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          <Menu aria-hidden="true" />
        </button>
      </div>

      {/* Replace the two baked-in hero buttons with one clear launch action. */}
      <div className="wk-hero-button-cover" aria-hidden="true" />
      <Link href="/collections/limited-drop" className="wk-limited-drop-button">View Limited Drops</Link>

      {/* Collection cards */}
      <Hotspot href="/collections/beach" label="High Tide collection" x={1.3} y={33.8} w={18.7} h={13.8} />
      <Hotspot href="/collections/men" label="Sunset Riders collection" x={20.7} y={33.8} w={18.7} h={13.8} />
      <Hotspot href="/collections/hats" label="Pier 7 collection" x={40.1} y={33.8} w={18.7} h={13.8} />
      <Hotspot href="/collections/hoodies" label="Salt Run collection" x={59.6} y={33.8} w={18.7} h={13.8} />
      <Hotspot href="/collections/women" label="Low Tide collection" x={79.0} y={33.8} w={19.0} h={13.8} />

      {/* Best sellers */}
      <Hotspot href="/collections/men" label="Ride the Tide Tee" x={1.2} y={54.7} w={15.7} h={15.5} />
      <Hotspot href="/collections/women" label="Wave Rider Tank" x={17.5} y={54.7} w={15.7} h={15.5} />
      <Hotspot href="/collections/men" label="Salty Soul Tee" x={33.8} y={54.7} w={15.7} h={15.5} />
      <Hotspot href="/collections/women" label="Good Times Crop" x={50.2} y={54.7} w={15.7} h={15.5} />
      <Hotspot href="/collections/hoodies" label="Tide Breaker Hoodie" x={66.5} y={54.7} w={15.7} h={15.5} />
      <Hotspot href="/collections/women" label="Yacht Club Tank" x={82.8} y={54.7} w={16.0} h={15.5} />

      {/* Newsletter remains routed to the working community signup for now. */}
      <Hotspot href="/community" label="Join the Crew" x={45.0} y={84.4} w={31.0} h={3.4} />

      {menuOpen && (
        <div className="wk-panel-backdrop" role="presentation" onClick={() => setMenuOpen(false)}>
          <aside className="wk-side-panel" aria-label="Navigation menu" onClick={event => event.stopPropagation()}>
            <button className="wk-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
            <h2>Explore Wet Kitty</h2>
            <PanelLink href="/collections/men" onClick={() => setMenuOpen(false)}>Men</PanelLink>
            <PanelLink href="/collections/women" onClick={() => setMenuOpen(false)}>Women</PanelLink>
            <PanelLink href="/collections/beach" onClick={() => setMenuOpen(false)}>Beach</PanelLink>
            <PanelLink href="/collections/hats" onClick={() => setMenuOpen(false)}>Accessories</PanelLink>
            <PanelLink href="/collections/limited-drop" onClick={() => setMenuOpen(false)}>Limited Drops</PanelLink>
            <PanelLink href="/founding-crew" onClick={() => setMenuOpen(false)}>Founding Crew</PanelLink>
            <PanelLink href="/community" onClick={() => setMenuOpen(false)}>About / Join the Crew</PanelLink>
            <PanelLink href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</PanelLink>
          </aside>
        </div>
      )}


      {wishlistOpen && (
        <div className="wk-panel-backdrop" role="presentation" onClick={() => setWishlistOpen(false)}>
          <aside className="wk-side-panel" aria-label="Wishlist" onClick={event => event.stopPropagation()}>
            <button className="wk-close" onClick={() => setWishlistOpen(false)} aria-label="Close wishlist"><X /></button>
            <h2>Your Wishlist</h2>
            <p>Your saved Wet Kitty gear will appear here. Wishlist accounts are coming with the full store launch.</p>
            <PanelLink href="/collections/limited-drop" onClick={() => setWishlistOpen(false)}>View Limited Drops</PanelLink>
            <PanelLink href="/collections/men" onClick={() => setWishlistOpen(false)}>Shop Sunset Riders</PanelLink>
            <PanelLink href="/collections/women" onClick={() => setWishlistOpen(false)}>Shop Low Tide</PanelLink>
          </aside>
        </div>
      )}

      {cartOpen && (
        <div className="wk-panel-backdrop" role="presentation" onClick={() => setCartOpen(false)}>
          <aside className="wk-side-panel" aria-label="Shopping cart" onClick={event => event.stopPropagation()}>
            <button className="wk-close" onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button>
            <h2>Your Cart</h2>
            {loading ? (
              <p>Loading cart…</p>
            ) : !cart || itemCount === 0 ? (
              <>
                <p>Your cart is empty.</p>
                <PanelLink href="/collections/men" onClick={() => setCartOpen(false)}>Start shopping</PanelLink>
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
        .wk-approved-home { position: relative; width: 100%; max-width: 1600px; margin: 0 auto; background: #f4eee3; line-height: 0; overflow: hidden; }
        .wk-approved-art { display: block; width: 100%; height: auto; user-select: none; -webkit-user-drag: none; }
        .wk-hotspot { position: absolute; z-index: 4; display: block; border: 0; border-radius: 4px; line-height: normal; color: transparent; background: transparent; outline-offset: 2px; cursor: pointer; }
        .wk-hotspot:focus-visible, .wk-top-nav a:focus-visible, .wk-header-actions button:focus-visible { outline: 2px solid #49d3cf; outline-offset: 2px; }
        .wk-hotspot[data-area="nav"] { border-radius: 0; }
        @media (hover: hover) {
          .wk-hotspot:hover { background: rgba(73, 211, 207, 0.10); box-shadow: inset 0 0 0 1px rgba(73, 211, 207, 0.35); }
          .wk-top-nav a:hover { color: #49d3cf; border-color: rgba(73,211,207,.75); }
          .wk-header-actions button:hover { color: #49d3cf; background: rgba(73,211,207,.12); }
        }

        .wk-top-nav { position: absolute; z-index: 12; left: 27.6%; top: .95%; width: 53.5%; height: 2.6%; display: flex; align-items: center; justify-content: space-between; gap: .15%; padding: 0 .35%; border-radius: 3px; background: rgba(5,15,17,.82); backdrop-filter: blur(4px); line-height: 1; }
        .wk-top-nav a { display: flex; align-items: center; justify-content: center; height: 72%; padding: 0 .5vw; border: 1px solid transparent; border-radius: 3px; color: #f6efe4; text-decoration: none; white-space: nowrap; font: 700 clamp(5px, .64vw, 11px)/1 Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
        .wk-header-actions { position: absolute; z-index: 13; left: 83.1%; top: .9%; width: 13.3%; height: 2.7%; display: flex; align-items: center; justify-content: space-around; padding: 0 .25%; border-radius: 3px; background: rgba(5,15,17,.82); backdrop-filter: blur(4px); line-height: 1; }
        .wk-header-actions button { position: relative; display: grid; place-items: center; width: 29%; height: 80%; padding: 0; border: 0; border-radius: 4px; color: #f6efe4; background: transparent; cursor: pointer; }
        .wk-header-actions svg { width: 62%; height: 62%; stroke-width: 1.8; }
        .wk-cart-count { position: absolute; top: -8%; right: 3%; min-width: 13px; height: 13px; display: grid; place-items: center; padding: 0 3px; border-radius: 999px; color: #071417; background: #49d3cf; font: 800 8px/1 Arial, sans-serif; }
        .wk-eyebrow-fix { position: absolute; z-index: 3; left: 30.2%; top: 8.15%; width: 40%; height: 2.2%; display: flex; gap: .55em; align-items: center; justify-content: center; line-height: 1; color: #f2eadf; font: 600 clamp(7px, 1.05vw, 17px)/1 Arial, sans-serif; letter-spacing: .19em; white-space: nowrap; text-shadow: 0 1px 4px rgba(0,0,0,.8); background: rgba(12,22,22,.36); backdrop-filter: blur(2px); }
        .wk-eyebrow-premium { color: #33c3c1; }
        .wk-hero-button-cover { position: absolute; z-index: 5; left: 28.7%; top: 23.25%; width: 42.6%; height: 4.55%; border-radius: 7px; background: rgba(7,18,20,.88); backdrop-filter: blur(8px); }
        .wk-limited-drop-button { position: absolute; z-index: 6; left: 37.0%; top: 23.82%; width: 26.0%; height: 3.25%; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border: 1.5px solid rgba(255,255,255,.92); border-radius: 4px; background: rgba(6,18,20,.64); color: #fffaf0; text-decoration: none; white-space: nowrap; font: 800 clamp(6px, .82vw, 14px)/1 Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; line-height: 1; box-shadow: 0 8px 22px rgba(0,0,0,.24); }
        .wk-limited-drop-button:hover { color: #071417; background: #49d3cf; border-color: #49d3cf; }
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
        @media (max-width: 700px) { .wk-eyebrow-fix { font-size: 6px; letter-spacing: .12em; } .wk-top-nav a { font-size: 4.2px; padding: 0 .15vw; } .wk-limited-drop-button { font-size: 5.2px; letter-spacing: .1em; } }
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
