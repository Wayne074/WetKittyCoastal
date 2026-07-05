import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { ArrowRight, Mail, Waves, Bike, Sparkles, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const heroImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85";

const collectionCards = [
  {
    title: "High Tide",
    subtitle: "Swimwear & Beach Gear",
    href: "/collections/beach",
    image:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Sunset Riders",
    subtitle: "Tees, Tanks & Hoodies",
    href: "/collections/men",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Pier 7",
    subtitle: "Caps & Accessories",
    href: "/collections/hats",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Salt Run",
    subtitle: "Long Sleeves & Lightweight",
    href: "/collections/hoodies",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Low Tide",
    subtitle: "Women’s Collection",
    href: "/collections/women",
    image:
      "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=900&q=80",
  },
];

const fallbackProducts = [
  { title: "Ride the Tide Tee", price: "$34.00", href: "/products/ride-the-tide-tee" },
  { title: "Wave Rider Tank", price: "$28.00", href: "/products/wave-rider-tank" },
  { title: "Salty Soul Tee", price: "$34.00", href: "/products/salty-soul-tee" },
  { title: "Good Times Crop", price: "$30.00", href: "/products/good-times-crop" },
  { title: "Tide Breaker Hoodie", price: "$62.00", href: "/products/tide-breaker-hoodie" },
  { title: "Yacht Club Tank", price: "$28.00", href: "/products/yacht-club-tank" },
];

export default function Home() {
  const { data: products = [] } = trpc.commerce.products.list.useQuery({ first: 6 });

  return (
    <div className="wk-home">
      <Hero />
      <Collections />
      <Pillars />
      <BestSellers products={products} />
      <LifestyleBand />
      <CrewCTA />
      <style>{styles}</style>
    </div>
  );
}

function Hero() {
  return (
    <section className="wk-hero">
      <div className="wk-hero-bg" />
      <div className="wk-hero-overlay" />
      <div className="wk-hero-content">
        <p className="wk-eyebrow">Premium Coastal • Biker Lifestyle</p>
        <h1>
          Ride the Tide.
          <span>Own the Night.</span>
        </h1>
        <p className="wk-hero-copy">
          Premium Beach & Biker Lifestyle Apparel for Men & Women. Built for
          saltwater, chrome, sunsets, and the people who chase all four.
        </p>
        <div className="wk-hero-buttons">
          <Link href="/collections/limited-drop">
            <button>Shop Now</button>
          </Link>
          <Link href="/collections/men">
            <button className="outline">View New Drops</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section className="wk-section wk-cream">
      <div className="wk-heading">
        <h2>Explore the Collections</h2>
      </div>
      <div className="wk-collection-grid">
        {collectionCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <article className="wk-collection-card">
              <img src={card.image} alt={card.title} />
              <div />
              <h3>{card.title}</h3>
              <p>{card.subtitle}</p>
              <span>
                Shop Now <ArrowRight size={18} />
              </span>
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
          <Icon size={34} />
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </section>
  );
}

function BestSellers({ products }: { products: any[] }) {
  const shown =
    products.length > 0
      ? products.slice(0, 6).map((p: any) => ({
          title: p.title,
          price: p.variants?.[0]?.price?.amount
            ? `$${p.variants[0].price.amount}`
            : "$34.00",
          href: `/products/${p.handle}`,
          image: p.images?.[0]?.url,
        }))
      : fallbackProducts;

  return (
    <section className="wk-section wk-cream">
      <div className="wk-heading">
        <h2>Best Sellers</h2>
      </div>
      <div className="wk-product-grid">
        {shown.map((product, i) => (
          <Link key={product.title} href={product.href}>
            <article className="wk-product-card">
              <div className="wk-product-image">
                {product.image ? (
                  <img src={product.image} alt={product.title} />
                ) : (
                  <div className="wk-shirt-mock">
                    <img src="/logo.png" alt="Wet Kitty" />
                  </div>
                )}
              </div>
              <h3>{product.title}</h3>
              <p>{product.price}</p>
              <div className="wk-swatches">
                <span />
                <span />
                <span />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LifestyleBand() {
  return (
    <section className="wk-lifestyle">
      <div className="wk-life-img a" />
      <div className="wk-life-img b" />
      <div className="wk-life-center">
        <p>Beach Bum</p>
        <p>Sea Kitty</p>
        <p>Biker Soul</p>
        <p>Wet Kitty</p>
      </div>
      <div className="wk-life-img c" />
      <div className="wk-life-img d" />
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
    subscribeMutation.mutate({ email });
  };

  return (
    <section className="wk-crew">
      <div>
        <h2>Join the Crew</h2>
        <p>Get first access to new drops, exclusive offers, and upcoming rallies & events.</p>
      </div>
      <form onSubmit={submit}>
        <Mail size={18} />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
        />
        <button type="submit">Sign Me Up</button>
      </form>
    </section>
  );
}

const styles = `
.wk-home {
  --ink: #070d19;
  --cream: #f6f0e5;
  --teal: #35b8b2;
  --gold: #d9bd6a;
  --muted: #6f6c66;
  background: var(--cream);
}

.wk-hero {
  position: relative;
  min-height: 82vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.wk-hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("${heroImage}");
  background-size: cover;
  background-position: center;
  transform: scale(1.04);
}

.wk-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(3,7,13,.82), rgba(3,7,13,.38), rgba(3,7,13,.7)),
    radial-gradient(circle at 72% 42%, rgba(217,189,106,.25), transparent 34%);
}

.wk-hero-content {
  position: relative;
  z-index: 2;
  max-width: 980px;
  padding: 7rem 1.25rem 5rem;
  text-align: center;
  color: white;
}

.wk-eyebrow {
  color: var(--teal);
  text-transform: uppercase;
  letter-spacing: .28em;
  font-weight: 800;
  font-size: .78rem;
  margin-bottom: 1rem;
}

.wk-hero h1 {
  font-family: Georgia, 'Times New Roman', serif;
  text-transform: uppercase;
  font-size: clamp(3.4rem, 9vw, 7.5rem);
  line-height: .88;
  letter-spacing: .02em;
  margin: 0;
}

.wk-hero h1 span {
  display: block;
  color: var(--gold);
  font-style: italic;
}

.wk-hero-copy {
  max-width: 520px;
  margin: 1.5rem auto 2rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(255,255,255,.86);
}

.wk-hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.wk-hero button,
.wk-crew button {
  border: 0;
  background: var(--teal);
  color: white;
  padding: .95rem 2.25rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .12em;
  border-radius: .25rem;
}

.wk-hero button.outline {
  background: transparent;
  border: 1px solid rgba(255,255,255,.7);
}

.wk-section {
  padding: 3.5rem 1rem;
}

.wk-cream {
  background: var(--cream);
}

.wk-heading {
  text-align: center;
  margin-bottom: 2rem;
}

.wk-heading h2 {
  font-family: Georgia, 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: .22em;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  color: var(--ink);
}

.wk-collection-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: .85rem;
}

.wk-collection-card {
  position: relative;
  min-height: 260px;
  overflow: hidden;
  border-radius: .35rem;
  color: white;
  cursor: pointer;
}

.wk-collection-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wk-collection-card div {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,.16));
}

.wk-collection-card h3,
.wk-collection-card p,
.wk-collection-card span {
  position: relative;
  z-index: 2;
  margin-left: 1rem;
  margin-right: 1rem;
}

.wk-collection-card h3 {
  margin-top: 9.5rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.65rem;
  font-style: italic;
}

.wk-collection-card p {
  text-transform: uppercase;
  letter-spacing: .13em;
  font-weight: 800;
  font-size: .72rem;
}

.wk-collection-card span {
  display: flex;
  align-items: center;
  gap: .4rem;
  color: var(--teal);
  text-transform: uppercase;
  letter-spacing: .12em;
  font-weight: 900;
  font-size: .78rem;
}

.wk-pillars {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #fbf7ee;
  border-top: 1px solid #e5dccb;
  border-bottom: 1px solid #e5dccb;
}

.wk-pillars div {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: .75rem;
  align-items: center;
}

.wk-pillars svg {
  color: var(--teal);
}

.wk-pillars h3 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: .12em;
  font-size: .75rem;
  color: var(--ink);
}

.wk-pillars p {
  margin: .1rem 0 0;
  color: var(--muted);
  font-size: .8rem;
}

.wk-product-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.wk-product-card {
  color: var(--ink);
}

.wk-product-image {
  aspect-ratio: 4 / 5;
  background: #e9dfcf;
  border-radius: .35rem;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.wk-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wk-shirt-mock {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #ebe2d5, #d8cbb8);
}

.wk-shirt-mock img {
  width: 58%;
  height: auto;
  opacity: .78;
  object-fit: contain;
}

.wk-product-card h3 {
  margin: .8rem 0 .25rem;
  font-weight: 900;
  font-size: .9rem;
}

.wk-product-card p {
  color: var(--muted);
  margin: 0 0 .5rem;
}

.wk-swatches {
  display: flex;
  gap: .35rem;
}

.wk-swatches span {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #f2efe7;
  border: 1px solid #bbb;
}

.wk-swatches span:nth-child(2) {
  background: #111;
}

.wk-swatches span:nth-child(3) {
  background: var(--teal);
}

.wk-lifestyle {
  display: grid;
  grid-template-columns: 1fr 1fr 1.15fr 1fr 1fr;
  min-height: 320px;
}

.wk-life-img {
  background-size: cover;
  background-position: center;
}

.wk-life-img.a { background-image: url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80"); }
.wk-life-img.b { background-image: url("https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=700&q=80"); }
.wk-life-img.c { background-image: url("https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=700&q=80"); }
.wk-life-img.d { background-image: url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80"); }

.wk-life-center {
  background: #278f88;
  color: white;
  display: grid;
  place-content: center;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: .22em;
  font-weight: 900;
  font-size: 1.25rem;
}

.wk-life-center p {
  margin: .35rem 0;
}

.wk-crew {
  background: linear-gradient(90deg, #b7eee8, #dff7f2);
  padding: 2.25rem 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 2rem;
  align-items: center;
}

.wk-crew h2 {
  font-family: Georgia, 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: .18em;
  font-size: clamp(1.8rem, 4vw, 3rem);
  color: var(--ink);
  margin: 0;
}

.wk-crew p {
  color: #334;
  max-width: 520px;
}

.wk-crew form {
  display: flex;
  align-items: center;
  background: white;
  max-width: 560px;
  margin-left: auto;
  border-radius: .35rem;
  overflow: hidden;
}

.wk-crew svg {
  margin-left: 1rem;
  color: var(--teal);
}

.wk-crew input {
  flex: 1;
  border: 0;
  padding: 1rem;
  outline: none;
}

.wk-crew button {
  border-radius: 0;
  background: var(--ink);
  white-space: nowrap;
}

@media (max-width: 900px) {
  .wk-collection-grid,
  .wk-product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .wk-pillars {
    grid-template-columns: repeat(2, 1fr);
  }

  .wk-lifestyle {
    grid-template-columns: 1fr 1fr;
  }

  .wk-life-center {
    grid-column: span 2;
    min-height: 240px;
  }

  .wk-crew {
    grid-template-columns: 1fr;
  }

  .wk-crew form {
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  .wk-hero {
    min-height: 78vh;
  }

  .wk-hero-content {
    text-align: left;
    padding-top: 5rem;
  }

  .wk-hero-buttons {
    justify-content: flex-start;
  }

  .wk-hero button {
    width: 100%;
  }

  .wk-collection-card {
    min-height: 230px;
  }

  .wk-product-grid {
    gap: .8rem;
  }

  .wk-pillars {
    grid-template-columns: 1fr;
  }

  .wk-crew form {
    flex-direction: column;
    align-items: stretch;
  }

  .wk-crew svg {
    display: none;
  }

  .wk-crew button {
    width: 100%;
  }
}
`;
