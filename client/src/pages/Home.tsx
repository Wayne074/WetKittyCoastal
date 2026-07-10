import { Link } from "wouter";

/**
 * Wet Kitty launch homepage.
 *
 * This deliberately uses the approved homepage artwork as the visual source of
 * truth so the live page matches the approved design instead of drifting into
 * another interpretation. Transparent links are placed over the visual buttons
 * and cards so the page is immediately usable while the store catalog is wired.
 */
export default function Home() {
  return (
    <main className="wk-approved-home" aria-label="Wet Kitty Coastal homepage">
      <img
        className="wk-approved-art"
        src="/home-assets/wet-kitty-homepage.png"
        alt="Wet Kitty Coastal — premium beach and biker lifestyle apparel"
      />

      {/* Main navigation */}
      <Hotspot href="/" label="Home" x={28.1} y={2.0} w={4.2} h={2.1} />
      <Hotspot href="/collections/men" label="Men" x={33.1} y={2.0} w={3.6} h={2.1} />
      <Hotspot href="/collections/women" label="Women" x={37.3} y={2.0} w={5.1} h={2.1} />
      <Hotspot href="/collections/men" label="Collections" x={43.0} y={2.0} w={8.0} h={2.1} />
      <Hotspot href="/collections/beach" label="Beach" x={52.1} y={2.0} w={5.3} h={2.1} />
      <Hotspot href="/events" label="Rallies" x={58.2} y={2.0} w={5.3} h={2.1} />
      <Hotspot href="/collections/hats" label="Accessories" x={64.4} y={2.0} w={8.0} h={2.1} />
      <Hotspot href="/community" label="About" x={73.5} y={2.0} w={5.1} h={2.1} />
      <Hotspot href="/wishlist" label="Wishlist" x={82.7} y={1.5} w={3.4} h={3.1} />

      {/* Hero buttons */}
      <Hotspot href="/collections/men" label="Shop now" x={31.8} y={24.2} w={15.1} h={3.1} />
      <Hotspot href="/collections/limited-drop" label="View new drops" x={49.3} y={24.2} w={15.0} h={3.1} />

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

      {/* Newsletter area routes to community until form is wired */}
      <Hotspot href="/community" label="Join the Crew" x={45.0} y={84.4} w={31.0} h={3.4} />

      <style>{`
        .wk-approved-home {
          position: relative;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          background: #f4eee3;
          line-height: 0;
          overflow: hidden;
        }

        .wk-approved-art {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          -webkit-user-drag: none;
        }

        .wk-hotspot {
          position: absolute;
          z-index: 4;
          display: block;
          border-radius: 5px;
          line-height: normal;
          color: transparent;
          background: transparent;
          outline-offset: 3px;
        }

        .wk-hotspot:focus-visible {
          outline: 3px solid #49d3cf;
          background: rgba(73, 211, 207, 0.15);
        }

        @media (hover: hover) {
          .wk-hotspot:hover {
            background: rgba(73, 211, 207, 0.10);
            box-shadow: inset 0 0 0 1px rgba(73, 211, 207, 0.35);
          }
        }

        @media (max-width: 640px) {
          .wk-approved-home {
            min-width: 0;
          }
        }
      `}</style>
    </main>
  );
}

function Hotspot({
  href,
  label,
  x,
  y,
  w,
  h,
}: {
  href: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <Link
      href={href}
      className="wk-hotspot"
      aria-label={label}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
    >
      {label}
    </Link>
  );
}
