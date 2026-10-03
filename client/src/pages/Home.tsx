import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Bike, Mail, Sparkles, Star, Waves } from "lucide-react";
import { SHOP_OPEN, setPageMeta } from "@/const";
import { trpc } from "@/lib/trpc";
import { cardImageUrls } from "@shared/commerce/featured";
import { toast } from "sonner";

/**
 * Approved homepage structure recovered from 04cdb1b
 * (client/src/pages/Home.tsx.backup and home-assets/wet-kitty-homepage-final.webp).
 * Presentation only: collection links and best sellers use the current catalog.
 */
const collectionCards = [
  {
    title: "High Tide",
    subtitle: "Swimwear & Beach Gear",
    href: "/collections/coastal-ride",
    image: "/home-assets/slices/card-high-tide.webp",
  },
  {
    title: "Sunset Riders",
    subtitle: "Men's Collection",
    href: "/collections/men",
    image: "/home-assets/slices/card-sunset-riders.webp",
  },
  {
    title: "Pier 7",
    subtitle: "Caps & Accessories",
    href: "/collections/accessories",
    image: "/home-assets/slices/card-pier-7.webp",
  },
  {
    title: "Salt Run",
    subtitle: "Long Sleeves & Lightweight",
    href: "/collections/hoodies",
    image: "/home-assets/slices/card-salt-run.webp",
  },
  {
    title: "Low Tide",
    subtitle: "Women's Collection",
    href: "/collections/women",
    image: "/home-assets/slices/card-low-tide.webp",
  },
];

const lifestyle = [
  { src: "/home-assets/slices/life-beach.webp", alt: "Beach day with a motorcycle" },
  { src: "/home-assets/slices/life-bonfire.webp", alt: "Bonfire on the beach" },
  { src: "/home-assets/slices/life-center.webp", alt: "Beach bum, sea kitty, biker soul" },
  { src: "/home-assets/slices/life-hoodie.webp", alt: "Wet Kitty hoodie at sunset" },
  { src: "/home-assets/slices/life-coast.webp", alt: "Gulf coast shoreline" },
];

export default function Home() {
  useEffect(() => {
    setPageMeta(
      "Wet Kitty Coastal | Beach • Biker • Apparel",
      "Ride the Tide. Own the Night. Premium beach and biker lifestyle apparel from Panama City Beach."
    );
  }, []);

  return (
    <div className="wk-home">
      <Hero />
      <Collections />
      <Pillars />
      {SHOP_OPEN && <BestSellers />}
      <LifestyleBand />
      <CrewCTA />
      <style>{styles}</style>
    </div>
  );
}

function Hero() {
  return (
    <section className="wk-hero">
      <h1 className="sr-only">Ride the Tide. Own the Night.</h1>
      <img
        className="wk-hero-art"
        src="/home-assets/slices/hero.webp"
        alt="Ride the Tide. Own the Night. A beach bar, a motorcycle, and the Gulf at sunset."
      />
      {/* The approved art bakes in a broken eyebrow ("PREMIUMEN"). Cover it, same as 6b86bcf. */}
      <div className="wk-eyebrow-fix" aria-hidden="true">
        <span>PREMIUM</span>
        <span>COASTAL • BIKER LIFESTYLE</span>
      </div>
      {SHOP_OPEN ? (
        <Link
          href="/collections/apparel"
          className="wk-hero-shop"
          aria-label="Shop tees, tanks, and hoodies"
        />
      ) : (
        <Link
          href="/founding-crew"
          className="wk-hero-shop"
          aria-label="Join the Founding Crew. Shop opening soon."
        />
      )}
    </section>
  );
}

function Collections() {
  return (
    <section className="wk-section">
      <div className="wk-heading">
        <h2>Explore the Collections</h2>
      </div>
      <div className="wk-collection-grid">
        {collectionCards.map(card => (
          <Link key={card.title} href={card.href}>
            <article className="wk-collection-card">
              <img src={card.image} alt={`${card.title}. ${card.subtitle}`} />
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Pillars() {
  const items = [
    { icon: Waves, title: "Coastal Inspired", text: "Born on the Gulf Coast" },
    { icon: Bike, title: "Built for Freedom", text: "Beach. Bikes. No limits." },
    { icon: Star, title: "Premium Quality", text: "Soft feel. Built to last." },
    { icon: Sparkles, title: "Live Salty", text: "Stay salty. Ride free." },
  ];

  return (
    <section className="wk-pillars">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title}>
          <Icon size={34} aria-hidden="true" />
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function BestSellers() {
  const { data: products = [], isLoading } = trpc.commerce.products.list.useQuery({
    first: 12,
  });
  const shown = products.filter(product => product.images.length).slice(0, 6);

  return (
    <section className="wk-section">
      <div className="wk-heading">
        <h2>Best Sellers</h2>
      </div>
      {shown.length ? (
        <div className="wk-product-grid">
          {shown.map((product, index) => {
            const image = cardImageUrls(product.images, index)[0];
            const price = Number.parseFloat(product.priceRange.min.amount).toFixed(2);
            return (
              <Link key={product.id} href={`/products/${product.handle}`}>
                <article className="wk-product-card">
                  <div className="wk-product-image">
                    {image ? <img src={image} alt={product.title} /> : null}
                  </div>
                  <h3>{product.title}</h3>
                  <p>${price}</p>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="wk-empty">{isLoading ? "Loading the drop…" : "New gear is on the way."}</p>
      )}
    </section>
  );
}

function LifestyleBand() {
  return (
    <section className="wk-lifestyle" aria-label="Wet Kitty lifestyle">
      {lifestyle.map(panel => (
        <img key={panel.src} src={panel.src} alt={panel.alt} />
      ))}
    </section>
  );
}

function CrewCTA() {
  const [email, setEmail] = useState("");
  const subscribeMutation = trpc.features.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Welcome to the Crew!");
      setEmail("");
    },
    onError: () => toast.error("Newsletter signup is not connected yet."),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email, source: "homepage" });
  };

  return (
    <section className="wk-crew">
      <div>
        <h2>Join the Crew</h2>
        <p>Get first access to new drops, exclusive offers, and upcoming rallies & events.</p>
      </div>
      <form onSubmit={submit}>
        <Mail size={18} aria-hidden="true" />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          required
          aria-label="Email address"
        />
        <button type="submit" disabled={subscribeMutation.isPending}>
          {subscribeMutation.isPending ? "Sending…" : "Sign Me Up"}
        </button>
      </form>
    </section>
  );
}

const styles = `
.wk-home {
  --ink: #070d19;
  --cream: #f6f0e5;
  --teal: #35b8b2;
  --muted: #6f6c66;
  background: var(--cream);
  color: var(--ink);
}
.wk-hero {
  position: relative;
  background: #12323a;
  line-height: 0;
}
.wk-hero-art {
  display: block;
  width: 100%;
  height: auto;
}
.wk-eyebrow-fix {
  position: absolute;
  z-index: 2;
  left: 24%;
  top: 9.1%;
  width: 52%;
  height: 6.4%;
  display: flex;
  gap: 0.65em;
  align-items: center;
  justify-content: center;
  color: #f4efe6;
  background: rgba(8, 22, 26, 0.94);
  font: 700 clamp(8px, 1.25vw, 14px)/1 Arial, sans-serif;
  letter-spacing: 0.16em;
  white-space: nowrap;
}
.wk-eyebrow-fix span:first-child {
  color: #7fd8d4;
}
.wk-hero-shop {
  position: absolute;
  z-index: 2;
  left: 39.5%;
  top: 74%;
  width: 21%;
  height: 11%;
  border-radius: 4px;
}
.wk-hero-shop:focus-visible {
  outline: 2px solid #49d3cf;
  outline-offset: 2px;
}
.wk-section {
  padding: 3.25rem 1rem 2.5rem;
}
.wk-heading {
  text-align: center;
  margin-bottom: 1.75rem;
}
.wk-heading h2,
.wk-crew h2 {
  font-family: Georgia, "Times New Roman", serif;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  color: var(--ink);
  margin: 0;
}
.wk-collection-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.85rem;
}
.wk-collection-card {
  display: block;
  border-radius: 0.35rem;
  overflow: hidden;
  line-height: 0;
}
.wk-collection-card img {
  display: block;
  width: 100%;
  height: auto;
}
.wk-pillars {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.1rem 1.2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #fbf7ee;
  border-top: 1px solid #e5dccb;
  border-bottom: 1px solid #e5dccb;
}
.wk-pillars > div {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 0.75rem;
  align-items: center;
}
.wk-pillars svg { color: var(--teal); }
.wk-pillars h3 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  color: var(--ink);
}
.wk-pillars p {
  margin: 0.15rem 0 0;
  color: var(--muted);
  font-size: 0.8rem;
}
.wk-product-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}
.wk-product-card { color: var(--ink); line-height: 1.3; }
.wk-product-image {
  aspect-ratio: 4 / 5;
  background: #e9dfcf;
  border-radius: 0.35rem;
  overflow: hidden;
}
.wk-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.wk-product-card h3 {
  margin: 0.8rem 0 0.25rem;
  font-weight: 800;
  font-size: 0.9rem;
}
.wk-product-card p {
  color: var(--muted);
  margin: 0;
}
.wk-empty {
  text-align: center;
  color: var(--muted);
}
.wk-lifestyle {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
.wk-lifestyle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 194 / 177;
}
.wk-crew {
  background: linear-gradient(90deg, #b7eee8, #dff7f2);
  padding: 2.25rem 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 2rem;
  align-items: center;
}
.wk-crew p { color: #334; max-width: 520px; margin: 0.6rem 0 0; }
.wk-crew form {
  display: flex;
  align-items: center;
  background: white;
  max-width: 560px;
  margin-left: auto;
  border-radius: 0.35rem;
  overflow: hidden;
}
.wk-crew svg { margin-left: 1rem; color: var(--teal); }
.wk-crew input {
  flex: 1;
  border: 0;
  padding: 1rem;
  outline: none;
  min-width: 0;
  background: white;
  color: var(--ink);
}
.wk-crew button {
  border: 0;
  border-radius: 0;
  background: var(--ink);
  color: white;
  padding: 1rem 1.4rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}
@media (max-width: 900px) {
  .wk-collection-grid,
  .wk-product-grid { grid-template-columns: repeat(2, 1fr); }
  .wk-collection-grid a:last-child { grid-column: 1 / -1; max-width: 50%; justify-self: center; width: 100%; }
  .wk-pillars { grid-template-columns: repeat(2, 1fr); }
  .wk-lifestyle { grid-template-columns: 1fr 1fr; }
  .wk-lifestyle img:nth-child(3) { grid-column: span 2; aspect-ratio: 2.2 / 1; }
  .wk-crew { grid-template-columns: 1fr; }
  .wk-crew form { margin-left: 0; }
}
@media (max-width: 560px) {
  .wk-collection-grid { grid-template-columns: 1fr; }
  .wk-collection-grid a:last-child { max-width: none; }
  .wk-product-grid { grid-template-columns: repeat(2, 1fr); }
  .wk-pillars { grid-template-columns: 1fr; }
  .wk-eyebrow-fix { letter-spacing: 0.08em; font-size: 8px; }
  .wk-crew form { flex-direction: column; align-items: stretch; }
  .wk-crew svg { display: none; }
  .wk-crew button { width: 100%; padding: 0.95rem; }
}
`;
