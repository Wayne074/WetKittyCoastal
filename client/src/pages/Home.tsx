import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { ArrowRight, Bike, Mail, Sparkles, Star, Waves } from "lucide-react";
import { setPageMeta } from "@/const";
import { trpc } from "@/lib/trpc";
import { cardImageUrls } from "@shared/commerce/featured";
import type { Product } from "@shared/commerce/types";
import { toast } from "sonner";

/**
 * Designed storefront homepage. Real HTML sections over separate image
 * files. Not a stacked story page and not a flattened composite.
 */
const HERO_SRC = "/images/lifestyle/hero-sunset.jpg";

const collectionCards = [
  {
    title: "Sunset Riders",
    subtitle: "Men's Collection",
    href: "/collections/men",
    image: "/images/lifestyle/mens-club.jpg",
    alt: "A boat running on open water",
  },
  {
    title: "Pier 7",
    subtitle: "Caps & Accessories",
    href: "/collections/accessories",
    image: "/images/lifestyle/club-night.jpg",
    alt: "A wood bar after dark",
  },
  {
    title: "Salt Run",
    subtitle: "Long Sleeves & Lightweight",
    href: "/collections/hoodies",
    image: "/images/lifestyle/coastal-road.jpg",
    alt: "The coastal road along the water",
  },
  {
    title: "Low Tide",
    subtitle: "Women's Collection",
    href: "/collections/women",
    image: "/images/lifestyle/womens-club.jpg",
    alt: "Sunset over the water",
  },
];

const FIRST_DROP_IDS = [
  "475065897",
  "475058494",
  "475066883",
  "475048514",
  "476302437",
  "475067704",
];

const lifestylePhotos = [
  { src: "/images/lifestyle/shop-all.jpg", alt: "Palm beach along the coast" },
  { src: "/images/lifestyle/after-dark.jpg", alt: "A drink on the bar after dark" },
  { src: "/images/lifestyle/coastal-boat.jpg", alt: "A boat along a green coast" },
  { src: "/images/lifestyle/mens-club.jpg", alt: "Open water off the coast" },
];

const COLOR_SWATCH: Record<string, string> = {
  black: "#161616",
  white: "#f7f4ee",
  navy: "#1b2a4a",
  orange: "#e06a1f",
  heliconia: "#e23b78",
  daisy: "#f2d23a",
  "tropical blue": "#2aa7c9",
  red: "#c0392b",
  grey: "#8d8d8d",
  gray: "#8d8d8d",
  sand: "#d9c4a0",
  natural: "#e6d3b4",
};

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
      <FirstDrop />
      <LifestyleBand />
      <CrewCTA />
      <style>{styles}</style>
    </div>
  );
}

function Hero() {
  return (
    <>
      <section className="wk-hero" aria-label="Wet Kitty Coastal">
        <img
          className="wk-hero-art"
          src={HERO_SRC}
          width={1672}
          height={941}
          alt="A tiki beach bar at sunset, a cat surfboard, a turquoise chair, and a black motorcycle on the sand."
        />
        <div className="wk-hero-copy">
          <p className="wk-eyebrow">Premium Coastal • Biker Lifestyle</p>
          <h1>
            <span>Ride the Tide.</span>
            <span>Own the Night.</span>
          </h1>
          <p className="wk-hero-lead">
            Premium Beach &amp; Biker Lifestyle Apparel for Men &amp; Women. Built for saltwater, chrome, sunsets, and the people who chase all four.
          </p>
        </div>
      </section>
      <div className="wk-hero-cta-strip" aria-label="Shop and Founding Crew">
        <div className="wk-hero-ctas">
          <Link href="/collections/apparel" className="wk-hero-btn">
            Shop Tees, Tanks &amp; Hoodies
          </Link>
          <Link href="/founding-crew" className="wk-hero-btn wk-hero-btn-crew">
            Join the Founding Crew
          </Link>
        </div>
      </div>
    </>
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
              <img src={card.image} alt={card.alt} />
              <div className="wk-card-shade" />
              <div className="wk-card-copy">
                <h3>{card.title}</h3>
                <p>{card.subtitle}</p>
                <span>
                  Shop Now <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
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
    { icon: Bike, title: "Built for Freedom", text: "Beach. Bikes. No Limits." },
    { icon: Star, title: "Premium Quality", text: "Soft feel. Built to last." },
    { icon: Sparkles, title: "Live Salty", text: "Stay Salty. Ride Free." },
  ];

  return (
    <section className="wk-pillars" aria-label="What Wet Kitty stands for">
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

function colorValues(product: Product) {
  const option = product.options.find(item => /color|colour/i.test(item.name));
  return (option?.values ?? []).slice(0, 4);
}

function FirstDrop() {
  const { data: products = [], isLoading, isError } = trpc.commerce.products.list.useQuery({
    first: 80,
  });
  const byId = new Map(products.map(product => [product.id, product]));
  const shown = FIRST_DROP_IDS.map(id => byId.get(id)).filter((product): product is Product => Boolean(product));

  return (
    <section className="wk-section wk-section-tight">
      <div className="wk-heading">
        <h2>First Drop</h2>
      </div>
      {shown.length ? (
        <div className="wk-product-grid">
          {shown.map((product, index) => {
            const image = cardImageUrls(product.images, index)[0];
            const price = Number.parseFloat(product.priceRange.min.amount).toFixed(2);
            const colors = colorValues(product);
            return (
              <Link key={product.id} href={`/products/${product.handle}`}>
                <article className="wk-product-card">
                  <div className="wk-product-image">
                    {image ? <img src={image} alt={product.title} /> : null}
                  </div>
                  <h3>{product.title}</h3>
                  <p>${price}</p>
                  {colors.length > 0 && (
                    <div className="wk-swatches" aria-label="Colors">
                      {colors.map(color => (
                        <span
                          key={color}
                          title={color}
                          style={{ background: COLOR_SWATCH[color.toLowerCase()] ?? "#cfc6b8" }}
                        />
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="wk-empty">
          {isLoading ? "Loading the drop…" : isError ? "The catalog is not available right now." : "New gear is on the way."}
        </p>
      )}
    </section>
  );
}

function LifestyleBand() {
  return (
    <section className="wk-lifestyle" aria-label="Wet Kitty lifestyle">
      <img src={lifestylePhotos[0].src} alt={lifestylePhotos[0].alt} />
      <img src={lifestylePhotos[1].src} alt={lifestylePhotos[1].alt} />
      <div className="wk-life-center">
        <p>SAME SAND.</p>
        <p>DIFFERENT BREED.</p>
      </div>
      <img src={lifestylePhotos[2].src} alt={lifestylePhotos[2].alt} />
      <img src={lifestylePhotos[3].src} alt={lifestylePhotos[3].alt} />
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
        <p>Get first access to new drops, exclusive offers, and upcoming rallies &amp; events.</p>
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
  overflow-x: clip;
  max-width: 100%;
}
.wk-hero {
  position: relative;
  background: #12323a;
}
.wk-hero-art {
  display: block;
  width: 100%;
  height: auto;
}
.wk-hero-copy {
  position: absolute;
  top: 5%;
  right: 3.5%;
  width: min(440px, 40%);
  text-align: right;
  color: #071014;
}
.wk-hero-copy::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: -22% -14% -16% -30%;
  background: radial-gradient(ellipse at 75% 30%, rgba(255, 244, 224, 0.72), rgba(255, 244, 224, 0.2) 58%, transparent 76%);
  pointer-events: none;
}
.wk-eyebrow {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  font-size: clamp(0.62rem, 1.1vw, 0.78rem);
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #0b3c42;
}
.wk-hero h1 {
  margin: 0.35rem 0 0;
  font-family: Cinzel, Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.45rem, 2.7vw, 2.55rem);
  line-height: 0.98;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #071014;
}
.wk-hero h1 span { display: block; }
.wk-hero-lead {
  margin: 0.65rem 0 0;
  font-family: Inter, system-ui, sans-serif;
  font-size: clamp(0.82rem, 1.2vw, 0.98rem);
  line-height: 1.45;
  color: #10242c;
}
.wk-hero-cta-strip {
  background: var(--cream);
  border-bottom: 1px solid #e5dccb;
  padding: 0.85rem 1rem 1rem;
}
.wk-hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  justify-content: center;
  align-items: center;
  max-width: 720px;
  margin: 0 auto;
}
.wk-hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0.55rem 1.05rem;
  border-radius: 999px;
  background: #071014;
  color: #f6f0e5;
  font-family: Inter, system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  flex: 1 1 auto;
  max-width: 280px;
  text-align: center;
}
.wk-hero-btn-crew {
  background: #0b3c42;
  color: #f6f0e5;
  box-shadow: 0 0 0 2px rgba(127, 216, 212, 0.85);
}
.wk-hero-btn:focus-visible { outline: 2px solid #071014; outline-offset: 3px; }
.wk-hero-btn-crew:focus-visible { outline: 2px solid #7fd8d4; outline-offset: 3px; }
.wk-section { padding: 2.75rem 1rem 1.5rem; }
.wk-section-tight { padding-bottom: 2.25rem; }
.wk-heading { text-align: center; margin-bottom: 1.35rem; }
.wk-heading h2,
.wk-crew h2 {
  font-family: Georgia, "Times New Roman", serif;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: clamp(1.45rem, 3.4vw, 2.2rem);
  color: var(--ink);
  margin: 0;
  font-weight: 500;
}
.wk-collection-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}
.wk-collection-card {
  position: relative;
  display: block;
  min-height: 300px;
  border-radius: 0.35rem;
  overflow: hidden;
  color: white;
}
.wk-collection-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.wk-card-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.08) 55%);
}
.wk-card-copy {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 0.9rem 0.75rem 0.85rem;
}
.wk-collection-card h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.2rem, 1.6vw, 1.6rem);
  letter-spacing: 0;
  text-transform: none;
}
.wk-collection-card p {
  margin: 0.3rem 0 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 800;
  font-size: 0.66rem;
  line-height: 1.35;
}
.wk-collection-card span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #7fd8d4;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 800;
  font-size: 0.68rem;
}
.wk-pillars {
  max-width: 1180px;
  margin: 0.4rem auto 0;
  padding: 1.1rem 1.15rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  background: #fbf7ee;
  border-top: 1px solid #e5dccb;
  border-bottom: 1px solid #e5dccb;
}
.wk-pillars > div {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 0.7rem;
  align-items: center;
}
.wk-pillars svg { color: var(--teal); }
.wk-pillars h3 {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
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
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;
}
.wk-product-card { color: var(--ink); line-height: 1.3; }
.wk-product-image {
  aspect-ratio: 4 / 5;
  background: #e9dfcf;
  border-radius: 0.35rem;
  overflow: hidden;
}
.wk-product-image img { width: 100%; height: 100%; object-fit: cover; }
.wk-product-card h3 {
  margin: 0.75rem 0 0.3rem;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 650;
  font-size: 0.8rem;
  line-height: 1.4;
  letter-spacing: 0;
  text-transform: none;
  text-wrap: balance;
}
.wk-product-card p { color: var(--muted); margin: 0; font-size: 0.9rem; }
.wk-swatches { display: flex; gap: 0.35rem; margin-top: 0.4rem; }
.wk-swatches span {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.25);
}
.wk-empty { text-align: center; color: var(--muted); }
.wk-lifestyle {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
.wk-lifestyle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1.05;
}
.wk-life-center {
  background: #1f8f8a;
  color: white;
  display: grid;
  place-content: center;
  text-align: center;
  min-height: 160px;
  padding: 1rem 0.6rem;
}
.wk-life-center p {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: clamp(0.95rem, 1.35vw, 1.3rem);
  line-height: 1.3;
  white-space: nowrap;
}
.wk-crew {
  background: linear-gradient(90deg, #b7eee8, #dff7f2);
  padding: 1.6rem 1.25rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 1.25rem;
  align-items: center;
}
.wk-crew p { color: #334; max-width: 34rem; margin: 0.45rem 0 0; font-size: 0.95rem; }
.wk-crew form {
  display: flex;
  align-items: center;
  background: white;
  max-width: 520px;
  width: 100%;
  margin-left: auto;
  border-radius: 0.35rem;
  overflow: hidden;
}
.wk-crew svg { margin-left: 1rem; color: var(--teal); flex: none; }
.wk-crew input {
  flex: 1;
  border: 0;
  padding: 0.9rem 1rem;
  outline: none;
  min-width: 0;
  background: white;
  color: var(--ink);
}
.wk-crew button {
  border: 0;
  background: var(--ink);
  color: white;
  padding: 0.95rem 1.15rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  cursor: pointer;
}
@media (max-width: 1100px) {
  .wk-collection-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wk-product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .wk-pillars { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wk-hero-copy { width: min(400px, 48%); }
}
@media (max-width: 800px) {
  .wk-lifestyle { grid-template-columns: 1fr 1fr; }
  .wk-life-center { grid-column: 1 / -1; aspect-ratio: auto; }
  .wk-life-center p { font-size: 1.35rem; letter-spacing: 0.06em; }
  .wk-crew { grid-template-columns: 1fr; padding: 1.35rem 1rem; }
  .wk-crew form { margin-left: 0; }
  .wk-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wk-collection-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wk-collection-card { min-height: 220px; }
}
@media (max-width: 720px) {
  .wk-hero { min-height: clamp(360px, 106vw, 430px); }
  .wk-hero-art {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 80% 58%;
  }
  .wk-hero-copy {
    position: relative;
    top: auto;
    right: auto;
    width: auto;
    text-align: left;
    padding: 0.7rem 0.85rem 0.85rem;
    background: linear-gradient(180deg, rgba(255, 248, 236, 0.88) 0%, rgba(255, 248, 236, 0.45) 70%, rgba(255, 248, 236, 0) 100%);
  }
  .wk-hero-copy::before { display: none; }
  .wk-eyebrow { font-size: 0.58rem; letter-spacing: 0.14em; }
  .wk-hero h1 { font-size: 1.4rem; margin-top: 0.2rem; }
  .wk-hero-lead { font-size: 0.78rem; line-height: 1.35; margin-top: 0.35rem; max-width: 18rem; }
  .wk-hero-cta-strip { padding: 0.7rem 0.75rem 0.85rem; }
  .wk-hero-ctas { gap: 0.45rem; flex-wrap: nowrap; }
  .wk-hero-btn {
    min-height: 38px;
    padding: 0.45rem 0.7rem;
    font-size: 0.6rem;
    letter-spacing: 0.06em;
    max-width: none;
    flex: 1 1 0;
  }
  .wk-crew form { flex-direction: column; align-items: stretch; }
  .wk-crew svg { display: none; }
  .wk-crew button { width: 100%; }
}
/* Phones and small tablets (below Tailwind md, 768px). Desktop untouched. */
@media (max-width: 767px) {
  .wk-hero-cta-strip { padding: 0.65rem 0.75rem 0.8rem; }
  .wk-section { padding: 1.4rem 0.75rem 0.75rem; }
  .wk-section-tight { padding-bottom: 1.25rem; }
  .wk-heading { margin-bottom: 0.8rem; }
  .wk-heading h2,
  .wk-crew h2 { font-size: 1.05rem; letter-spacing: 0.12em; }
  .wk-collection-grid { gap: 0.5rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wk-collection-card { min-height: 150px; }
  .wk-card-copy { padding: 0.55rem 0.6rem 0.6rem; }
  .wk-collection-card h3 { font-size: 1.05rem; }
  .wk-collection-card p { margin: 0.15rem 0 0.3rem; font-size: 0.56rem; letter-spacing: 0.05em; }
  .wk-collection-card span { font-size: 0.58rem; }
  .wk-collection-card span svg { width: 12px; height: 12px; }
  .wk-pillars { margin: 0.25rem 0.75rem 0; padding: 0.7rem 0.75rem; gap: 0.6rem 0.75rem; }
  .wk-pillars > div { grid-template-columns: 24px minmax(0, 1fr); gap: 0.5rem; }
  .wk-pillars svg { width: 22px; height: 22px; }
  .wk-pillars h3 { font-size: 0.62rem; letter-spacing: 0.06em; }
  .wk-pillars p { font-size: 0.7rem; margin-top: 0.1rem; }
  .wk-product-grid { gap: 0.9rem 0.6rem; }
  .wk-product-image { aspect-ratio: 1 / 1; }
  .wk-product-card h3 { margin: 0.45rem 0 0.15rem; font-size: 0.76rem; line-height: 1.3; }
  .wk-product-card p { font-size: 0.82rem; }
  .wk-swatches { margin-top: 0.3rem; gap: 0.3rem; }
  .wk-swatches span { width: 12px; height: 12px; }
  .wk-lifestyle img { aspect-ratio: 16 / 10; }
  .wk-life-center { min-height: 0; padding: 0.7rem 0.6rem; }
  .wk-life-center p { font-size: 1.05rem; letter-spacing: 0.06em; line-height: 1.25; }
  .wk-crew { padding: 1.1rem 0.85rem; gap: 0.7rem; }
  .wk-crew p { font-size: 0.82rem; margin-top: 0.3rem; }
  .wk-crew form { flex-direction: row; align-items: center; }
  .wk-crew input { padding: 0.7rem 0.75rem; font-size: 16px; }
  .wk-crew button { width: auto; padding: 0.78rem 0.85rem; font-size: 0.72rem; }
}
`;
