import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Waves, Star, Sparkles } from "lucide-react";
import { WaveSeparator, PawLoader, PostcardProductCard } from "@/components/brand";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/* ═══════════════════════════════════════════════════════════
   WET KITTY — HOMEPAGE
   An immersive brand experience. Not a catalog.
   ═══════════════════════════════════════════════════════════ */

export default function Home() {
  const { data: products = [], isLoading } = trpc.commerce.products.list.useQuery({ first: 8 });

  return (
    <div className="min-h-screen">
      <HeroSection />
      <WaveSeparator />
      <MarqueeStrip />
      <CollectionsSection />
      <WaveSeparator />
      <FeaturedProducts products={products} isLoading={isLoading} />
      <BrandStorySection />
      <WaveSeparator />
      <CrewCTASection />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* HERO SECTION — Golden-hour glow, the first 3-second wow     */
/* ─────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #040a0e 0%, #0a2530 30%, #0d3040 50%, #0a2530 70%, #040a0e 100%)",
          }}
        />
        {/* Golden-hour glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 75% 35%, rgba(216, 195, 155, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 15% 65%, rgba(21, 154, 153, 0.14) 0%, transparent 50%)",
          }}
        />
        {/* Sun rays */}
        <div
          className="absolute top-0 right-0 w-2/3 h-full opacity-15"
          style={{
            background: "conic-gradient(from 200deg at 90% 25%, rgba(216, 195, 155, 0.4) 0deg, transparent 25deg, transparent 335deg, rgba(216, 195, 155, 0.3) 360deg)",
          }}
        />
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Palm leaf shadow — top left */}
        <div
          className="absolute -top-10 -left-10 w-72 h-72 opacity-[0.05] rotate-12"
          style={{
            background: "var(--sand)",
            maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M20,180 Q60,120 100,80 Q80,60 40,20 Q70,50 100,80 Q120,40 160,10 Q130,50 100,80 Q140,70 180,40 Q140,80 100,100 Q150,110 190,90 Q140,120 100,120 Q130,150 150,180 Q110,150 90,130 Q80,160 60,190 Q70,150 80,120 Q50,140 20,180Z' fill='white'/%3E%3C/svg%3E")`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="h-px w-8" style={{ background: "var(--sea)" }} />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "var(--sea)" }}>
              Premium Coastal &bull; Biker Lifestyle
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <span
              className="block text-white"
              style={{
                fontFamily: "var(--font-editorial)",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Ride the Tide.
            </span>
            <span
              className="block mt-2"
              style={{
                fontFamily: "var(--font-editorial)",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                fontStyle: "italic",
                background: "linear-gradient(135deg, var(--sea) 0%, var(--sand) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Own the Night.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl mb-10 max-w-xl animate-fade-up"
            style={{ color: "rgba(255, 250, 240, 0.7)", lineHeight: 1.7, animationDelay: "600ms" }}
          >
            Premium beach &amp; biker lifestyle apparel. Built for saltwater, chrome, sunsets, and the people who chase all four.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "800ms" }}>
            <Link href="/collections/limited-drop">
              <button className="btn btn-primary btn-lg group">
                Shop New Drops
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/community">
              <button
                className="btn btn-lg"
                style={{
                  background: "rgba(255, 250, 240, 0.06)",
                  color: "var(--cream)",
                  border: "1px solid rgba(255, 250, 240, 0.15)",
                }}
              >
                Join the Crew
              </button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-14 animate-fade-up" style={{ animationDelay: "1000ms" }}>
            {["Beach Born", "Road Proven", "Made for Good Times"].map((text, i) => (
              <span key={i} className="flex items-center gap-2 text-xs font-medium" style={{ color: "rgba(255, 250, 240, 0.4)" }}>
                {i > 0 && <span className="w-1 h-1 rounded-full bg-white/20" />}
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* MARQUEE STRIP                                               */
/* ─────────────────────────────────────────────────────────── */

function MarqueeStrip() {
  const items = ["Saltwater", "Chrome", "Sunsets", "Beach Bars", "Good Trouble", "Ride Free", "Stay Salty", "Own the Night"];
  return (
    <section className="py-4 overflow-hidden border-y border-border/30" style={{ background: "var(--card)" }}>
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 md:mx-10 text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
            {item}
            <span className="ml-6 md:ml-10" style={{ color: "var(--teal)", opacity: 0.4 }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* COLLECTIONS — Story-driven cards                            */
/* ─────────────────────────────────────────────────────────── */

function CollectionsSection() {
  const collections = [
    {
      title: "Sunset Riders",
      subtitle: "Men's Collection",
      description: "Tees, hoodies, and caps for the ones who chase the horizon.",
      href: "/collections/men",
      gradient: "linear-gradient(160deg, #0d3040 0%, #1a4a5a 50%, #2a5a62 100%)",
      accent: "var(--teal)",
    },
    {
      title: "Chrome & Coast",
      subtitle: "Women's Collection",
      description: "Flirty, beachy, and still premium. Designed for the ride and the rally.",
      href: "/collections/women",
      gradient: "linear-gradient(160deg, #2a1a3a 0%, #3a2a4a 50%, #4a3a5a 100%)",
      accent: "var(--sand)",
    },
    {
      title: "High Tide",
      subtitle: "Beach Collection",
      description: "Saltwater-ready gear. Board shorts, tanks, and everything sun-kissed.",
      href: "/collections/beach",
      gradient: "linear-gradient(160deg, #0a3040 0%, #0d4050 50%, #1a5060 100%)",
      accent: "var(--sea)",
    },
    {
      title: "Last Call",
      subtitle: "Limited Drops",
      description: "Once they're gone, they're gone. Exclusive runs, numbered pieces.",
      href: "/collections/limited-drop",
      gradient: "linear-gradient(160deg, #1a1a1a 0%, #2a2020 50%, #3a2a20 100%)",
      accent: "var(--sand)",
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-14">
          <span className="eyebrow mb-3 block">Explore</span>
          <h2 className="display-md text-foreground">The Collections</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm">
            Each collection tells a story. Find yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {collections.map((col) => (
            <Link key={col.href} href={col.href}>
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl"
                style={{ minHeight: "260px", transitionTimingFunction: "var(--ease-out)" }}
              >
                <div className="absolute inset-0" style={{ background: col.gradient }} />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${col.accent}18, transparent 70%)` }}
                />
                <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-end">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: col.accent }}>
                    {col.subtitle}
                  </span>
                  <h3
                    className="text-2xl md:text-3xl font-bold text-white mb-2 transition-transform duration-500 group-hover:translate-x-1"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
                  >
                    {col.title}
                  </h3>
                  <p className="text-sm text-white/55 max-w-xs mb-4">{col.description}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: col.accent }}>
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* FEATURED PRODUCTS — Postcard-style                          */
/* ─────────────────────────────────────────────────────────── */

function FeaturedProducts({ products, isLoading }: { products: any[]; isLoading: boolean }) {
  return (
    <section className="section">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="eyebrow mb-3 block">Fresh Gear</span>
            <h2 className="display-md text-foreground">First Drop Ideas</h2>
          </div>
          <Link href="/collections/men" className="hidden md:flex items-center gap-2 text-sm font-semibold text-teal hover:opacity-80 transition-opacity">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <PawLoader size="lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product: any) => (
              <PostcardProductCard
                key={product.id}
                handle={product.handle}
                title={product.title}
                price={product.variants?.[0]?.price?.amount || "0"}
                imageUrl={product.images?.[0]?.url}
                tags={product.tags || []}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {["Coastal Rider Hoodie", "Saltwater Trucker Hat", "Tidebreaker Beach Tee", "Chrome Goddess Tank"].map((title) => (
              <PostcardProductCard
                key={title}
                handle={title.toLowerCase().replace(/\s+/g, "-")}
                title={title}
                price="49.99"
                tags={[]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* BRAND STORY                                                 */
/* ─────────────────────────────────────────────────────────── */

function BrandStorySection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--ink)" }}>
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-[0.04]"
        style={{ background: "radial-gradient(circle, var(--sea) 0%, transparent 70%)" }}
      />
      <div className="container py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block" style={{ color: "var(--sea)" }}>
              The Wet Kitty Way
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-editorial)", lineHeight: 1.2 }}
            >
              Ready for print, embroidery, and drops.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255, 250, 240, 0.65)" }}>
              We partner with Printful to bring you on-demand apparel and embroidery products.
              Every item is made to order with premium quality and fast shipping.
              No warehouses, no waste — just gear made when you want it.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Waves, label: "Premium Fabrics" },
                { icon: Star, label: "Custom Embroidery" },
                { icon: Sparkles, label: "Limited Runs" },
                { icon: Waves, label: "Fast Shipping" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(121, 212, 205, 0.1)" }}>
                    <Icon className="w-4 h-4" style={{ color: "var(--sea)" }} />
                  </div>
                  <span className="text-sm font-medium text-white/80">{label}</span>
                </div>
              ))}
            </div>
            <Link href="/collections/limited-drop">
              <button className="btn btn-primary">
                Shop Limited Drops
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
          </div>

          {/* Right — Embroidery showcase */}
          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden aspect-[4/5] flex items-center justify-center p-8"
              style={{
                background: "linear-gradient(160deg, rgba(21, 154, 153, 0.08) 0%, rgba(121, 212, 205, 0.12) 50%, rgba(216, 195, 155, 0.08) 100%)",
                border: "1px solid rgba(121, 212, 205, 0.1)",
              }}
            >
              <div className="text-center">
                <div
                  className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(121, 212, 205, 0.1)" }}
                >
                  <span className="text-3xl font-bold" style={{ color: "var(--sea)", fontFamily: "var(--font-display)" }}>WK</span>
                </div>
                <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Embroidery Products</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Trucker Hats", "Dad Hats", "Hoodies", "Polos", "Chest Logos", "Sleeve Logos", "Patches"].map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: "rgba(121, 212, 205, 0.1)", color: "var(--sea)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* JOIN THE CREW CTA                                           */
/* ─────────────────────────────────────────────────────────── */

function CrewCTASection() {
  const [email, setEmail] = useState("");

  const subscribeMutation = trpc.features.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Welcome to the Crew!");
      setEmail("");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email });
  };

  return (
    <section className="section">
      <div className="container">
        <div
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{ background: "linear-gradient(160deg, var(--ink) 0%, #0d3a4a 50%, var(--ink) 100%)" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(21, 154, 153, 0.1) 0%, transparent 60%)" }}
          />
          <div className="relative z-10">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block" style={{ color: "var(--sea)" }}>
              Join the Crew
            </span>
            <h2
              className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-editorial)", lineHeight: 1.2 }}
            >
              First access to limited drops, beach rallies, and trouble worth showing up for.
            </h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255, 250, 240, 0.5)" }}>
              We'll never spam you. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 rounded-full text-sm bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:border-sea/60 focus:outline-none transition-colors"
              />
              <button type="submit" disabled={subscribeMutation.isPending} className="btn btn-primary whitespace-nowrap">
                {subscribeMutation.isPending ? "Joining..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
