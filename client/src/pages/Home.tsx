import { useEffect } from "react";
import { Link } from "wouter";
import { SHOP_OPEN, SHIPPING_SUMMARY, SUPPORT_EMAIL, setPageMeta } from "@/const";
import { trpc } from "@/lib/trpc";
import { SHOP_SECTIONS } from "@shared/commerce/sections";
import PostcardProductCard from "@/components/brand/PostcardProductCard";

/**
 * Real-HTML, responsive homepage. While the shop is closed it is a clean
 * Coming Soon page (no products); with the shop open it adds the first
 * products of the Shop All "Featured" order and the section links.
 */
export default function Home() {
  useEffect(() => {
    setPageMeta(
      "Wet Kitty Coastal | Beach • Biker • Apparel",
      "Wet Kitty Coastal: beach and biker lifestyle apparel, born in Panama City Beach. Stay Salty. Ride Free. Life's Better Wet."
    );
  }, []);

  return (
    <div className="bg-background">
      <section
        className="relative overflow-hidden"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, #0f3a3d 0%, #071417 60%, #050d0f 100%)" }}
      >
        <div className="container relative py-20 md:py-32 text-center">
          <span
            className="inline-block mb-6 px-4 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--sea)", border: "1px solid rgba(121,212,205,.35)" }}
          >
            Premium Coastal • Biker Lifestyle
          </span>
          <h1
            className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stay Salty. Ride Free.
            <br />
            <span style={{ color: "var(--sea)" }}>Life&apos;s Better Wet.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg" style={{ color: "rgba(255,250,240,.75)" }}>
            {SHOP_OPEN
              ? "Tees, hoodies, hats and more for the riders, the beach lovers and the good-time chasers. Made to order in Panama City Beach style."
              : "Our first drop of tees, hoodies and hats is almost here. Join the Founding Crew to get in first."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            {SHOP_OPEN && (
              <Link href="/collections/apparel" className="btn btn-primary w-full sm:w-auto">
                Shop the drop
              </Link>
            )}
            <Link
              href="/founding-crew"
              className={SHOP_OPEN ? "btn w-full sm:w-auto" : "btn btn-primary w-full sm:w-auto"}
              style={SHOP_OPEN ? { color: "#fff", border: "1px solid rgba(255,255,255,.35)" } : undefined}
            >
              Join the Founding Crew
            </Link>
          </div>
          {!SHOP_OPEN && (
            <p className="mt-6 text-sm" style={{ color: "rgba(255,250,240,.55)" }}>
              Shop opening soon.
            </p>
          )}
        </div>
      </section>

      {SHOP_OPEN && <NewDrop />}
      {SHOP_OPEN && <Sections />}

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 md:p-12 text-center">
          <span className="eyebrow mb-3 block">Founding Crew</span>
          <h2 className="text-3xl md:text-4xl mb-4">Get in before everyone else</h2>
          <p className="text-muted-foreground mb-8">
            Be one of the first members of the Wet Kitty crew. Founding members get the first gear, crew perks and a spot on the wall.
          </p>
          <Link href="/founding-crew" className="btn btn-primary">
            See the Founding Crew kit
          </Link>
          <p className="mt-8 text-sm text-muted-foreground">
            Questions? Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-teal underline underline-offset-2">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

function NewDrop() {
  const { data: products = [], isLoading } = trpc.commerce.products.list.useQuery({ first: 100 });
  const featured = products.filter(product => product.images.length).slice(0, 8);
  return (
    <section className="container py-14 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow mb-2 block">Made to order</span>
          <h2 className="text-3xl md:text-4xl">The New Drop</h2>
        </div>
        <Link href="/collections/apparel" className="text-sm font-bold uppercase tracking-wider text-teal whitespace-nowrap">
          Shop all &rarr;
        </Link>
      </div>
      {featured.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map(product => (
            <PostcardProductCard
              key={product.id}
              handle={product.handle}
              title={product.title}
              price={Number.parseFloat(product.priceRange.min.amount).toFixed(2)}
              imageUrl={product.images[0]?.url}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">{isLoading ? "Loading the new drop…" : "New gear is on the way."}</p>
      )}
      <p className="mt-8 text-sm text-muted-foreground">{SHIPPING_SUMMARY}</p>
    </section>
  );
}

function Sections() {
  return (
    <section className="border-t border-border/60 bg-card">
      <div className="container py-14 md:py-20">
        <h2 className="text-3xl md:text-4xl mb-8">Shop by collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SHOP_SECTIONS.map(section => (
            <Link
              key={section.handle}
              href={`/collections/${section.handle}`}
              className="block rounded-2xl p-6 transition-transform hover:-translate-y-1"
              style={{ background: "linear-gradient(160deg, #0f3a3d 0%, #071417 100%)" }}
            >
              <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--sea)" }}>
                {section.title}
              </span>
              <span className="block text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {section.subtitle}
              </span>
              <span className="block text-sm" style={{ color: "rgba(255,250,240,.65)" }}>{section.tagline}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
