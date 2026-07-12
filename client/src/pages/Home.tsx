import { useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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
      <img
        className="wk-approved-art"
        src="/home-assets/wet-kitty-homepage.png"
        alt="Wet Kitty Coastal — premium beach and biker lifestyle apparel"
      />

      {/* Correct the misspelled wording baked into the approved artwork. */}
      <div className="wk-eyebrow-fix" aria-label="Premium Coastal Biker Lifestyle">
        <span>PREMIUM</span> COASTAL&nbsp; • &nbsp;BIKER LIFESTYLE
      </div>

      {/* Main navigation. Tight hitboxes keep hover/focus aligned with labels. */}
      <Hotspot area="nav" href="/" label="Home" x={29.05} y={1.55} w={3.25} h={1.75} />
      <Hotspot area="nav" href="/collections/men" label="Men" x={34.35} y={1.55} w={2.65} h={1.75} />
      <Hotspot area="nav" href="/collections/women" label="Women" x={38.45} y={1.55} w={4.15} h={1.75} />
      <Hotspot area="nav" href="/collections/men" label="Collections" x={44.55} y={1.55} w={6.7} h={1.75} />
      <Hotspot area="nav" href="/collections/beach" label="Beach" x={54.25} y={1.55} w={4.0} h={1.75} />
      <Hotspot area="nav" href="/events" label="Rallies" x={60.15} y={1.55} w={4.15} h={1.75} />
      <Hotspot area="nav" href="/collections/hats" label="Accessories" x={66.35} y={1.55} w={6.85} h={1.75} />
      <Hotspot area="nav" href="/community" label="About" x={76.2} y={1.55} w={3.9} h={1.75} />

      {/* Header action icons */}
      <Hotspot href="/wishlist" label="Wishlist" x={84.55} y={1.15} w={2.75} h={2.45} />
      <button
        type="button"
        className="wk-action-hotspot"
        aria-label={`Open shopping cart${itemCount ? `, ${itemCount} items` : ""}`}
        style={{ left: "88.85%", top: "1.15%", width: "2.75%", height: "2.45%" }}
        onClick={() => setCartOpen(true)}
      />
      <button
        type="button"
        className="wk-action-hotspot"
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        style={{ left: "93.1%", top: "1.15%", width: "2.75%", height: "2.45%" }}
        onClick={() => setMenuOpen(true)}
      />

      {/* Hero buttons */}
      <Hotspot href="/collections/men" label="Shop now" x={32.05} y={24.15} w={15.0} h={3.15} />
      <Hotspot href="/collections/limited-drop" label="View new drops" x={49.65} y={24.15} w={15.0} h={3.15} />

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
            <PanelLink href="/events" onClick={() => setMenuOpen(false)}>Rallies</PanelLink>
            <PanelLink href="/community" onClick={() => setMenuOpen(false)}>About / Join the Crew</PanelLink>
            <PanelLink href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</PanelLink>
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
        .wk-hotspot, .wk-action-hotspot { position: absolute; z-index: 4; display: block; border: 0; border-radius: 4px; line-height: normal; color: transparent; background: transparent; outline-offset: 2px; cursor: pointer; }
        .wk-hotspot:focus-visible, .wk-action-hotspot:focus-visible { outline: 2px solid #49d3cf; background: rgba(73, 211, 207, 0.14); }
        .wk-hotspot[data-area="nav"] { border-radius: 0; }
        @media (hover: hover) {
          .wk-hotspot:not([data-area="nav"]):hover, .wk-action-hotspot:hover { background: rgba(73, 211, 207, 0.10); box-shadow: inset 0 0 0 1px rgba(73, 211, 207, 0.35); }
          .wk-hotspot[data-area="nav"]:hover { background: linear-gradient(to top, rgba(73,211,207,.9) 0 2px, transparent 2px); }
        }
        .wk-eyebrow-fix { position: absolute; z-index: 3; left: 31.2%; top: 8.15%; width: 38%; height: 2.2%; display: flex; align-items: center; justify-content: center; line-height: 1; color: #f2eadf; font: 600 clamp(7px, 1.05vw, 17px)/1 Arial, sans-serif; letter-spacing: .19em; white-space: nowrap; text-shadow: 0 1px 4px rgba(0,0,0,.8); background: rgba(12,22,22,.36); backdrop-filter: blur(2px); }
        .wk-eyebrow-fix span { color: #33c3c1; }
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
        @media (max-width: 700px) { .wk-eyebrow-fix { font-size: 6px; letter-spacing: .12em; } }
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
