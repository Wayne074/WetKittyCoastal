import { useEffect } from "react";
import { Link } from "wouter";
import {
  SHOP_OPEN,
  SHIPPING_SUMMARY,
  SUPPORT_EMAIL,
  setPageMeta,
} from "@/const";
import { trpc } from "@/lib/trpc";
import { CUSTOMER_NAV_SECTIONS } from "@shared/commerce/sections";
import { cardImageUrls } from "@shared/commerce/featured";
import PostcardProductCard from "@/components/brand/PostcardProductCard";

/**
 * Real-HTML, responsive homepage. While the shop is closed it is a clean
 * Coming Soon page (no products); with the shop open it tells the Gulf Coast
 * life between the merch, then the first products of the Shop All order.
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
      <section className="relative overflow-hidden min-h-[420px] md:min-h-[520px] flex items-center">
        <img
          src="/images/lifestyle/shop-all.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,16,18,0.35) 0%, rgba(5,16,18,0.72) 100%)",
          }}
        />
        <div className="container relative py-16 md:py-24 text-center">
          <span
            className="inline-block mb-6 px-4 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.25em]"
            style={{
              color: "var(--sea)",
              border: "1px solid rgba(121,212,205,.35)",
            }}
          >
            Panama City Beach • Gulf Coast
          </span>
          <h1
            className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stay Salty. Ride Free.
            <br />
            <span style={{ color: "var(--sea)" }}>Life&apos;s Better Wet.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg"
            style={{ color: "rgba(255,250,240,.82)" }}
          >
            {SHOP_OPEN
              ? "For the weekends that start on the boat and do not make it home early. Beach, bikes, friends, and the night after."
              : "Our first drop of tees, hoodies and hats is almost here. Join the Founding Crew to get in first."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            {SHOP_OPEN && (
              <Link
                href="/collections/apparel"
                className="btn btn-primary w-full sm:w-auto"
              >
                Shop the drop
              </Link>
            )}
            <Link
              href="/founding-crew"
              className={
                SHOP_OPEN
                  ? "btn w-full sm:w-auto"
                  : "btn btn-primary w-full sm:w-auto"
              }
              style={
                SHOP_OPEN
                  ? { color: "#fff", border: "1px solid rgba(255,255,255,.35)" }
                  : undefined
              }
            >
              Join the Founding Crew
            </Link>
          </div>
          {!SHOP_OPEN && (
            <p
              className="mt-6 text-sm"
              style={{ color: "rgba(255,250,240,.55)" }}
            >
              Shop opening soon.
            </p>
          )}
        </div>
      </section>

      <StoryBand
        eyebrow="Who it's for"
        title="Not a shirt company. A weekend."
        body="Wet Kitty is Panama City Beach and the Gulf Coast around it. Boats, trucks, bikes, beach days, bars, and the people you stay out with. The gear is how you wear that, not the other way around."
        image="/images/lifestyle/coastal-boat.jpg"
        imageLeft
      />

      {SHOP_OPEN && <NewDrop />}

      {SHOP_OPEN && (
        <section className="border-t border-border/60">
          <div className="grid md:grid-cols-2">
            <ClubBand
              href="/collections/men"
              image="/images/lifestyle/mens-club.jpg"
              kicker="Men's Club"
              title="The night starts on the water."
              body="Beach, boats and fishing, trucks and cars, bikes, then the bar. Guys' night, date night, a weekend that runs long."
            />
            <ClubBand
              href="/collections/women"
              image="/images/lifestyle/womens-club.jpg"
              kicker="Women's Club"
              title="Sun on the water. Lights after."
              body="Beach, boats, and the water, then nightlife, girls' night, and date night. Confident, sexy, and independent. She looks like that because she wants to."
            />
          </div>
        </section>
      )}

      {SHOP_OPEN && <Sections />}

      <StoryBand
        eyebrow="After dark"
        title="The dock, then the lights."
        body="Daytime is salt and highway. Night is the bonfire, the bar, and staying out because you want to. That is the whole brand."
        image="/images/lifestyle/club-night.jpg"
      />

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 md:p-12 text-center">
          <span className="eyebrow mb-3 block">Founding Crew</span>
          <h2 className="text-3xl md:text-4xl mb-4">
            Get in before everyone else
          </h2>
          <p className="text-muted-foreground mb-8">
            Be one of the first members of the Wet Kitty crew. Founding members
            get the first gear, crew perks and a spot on the wall.
          </p>
          <Link href="/founding-crew" className="btn btn-primary">
            See the Founding Crew kit
          </Link>
          <p className="mt-8 text-sm text-muted-foreground">
            Questions? Email{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold text-teal underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

function StoryBand({
  eyebrow,
  title,
  body,
  image,
  imageLeft = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageLeft?: boolean;
}) {
  return (
    <section className="container py-12 md:py-16">
      <div
        className={`grid md:grid-cols-2 gap-6 md:gap-10 items-center ${imageLeft ? "" : ""}`}
      >
        <img
          src={image}
          alt=""
          className={`h-64 md:h-80 w-full object-cover rounded-3xl ${imageLeft ? "md:order-1" : "md:order-2"}`}
        />
        <div className={imageLeft ? "md:order-2" : "md:order-1"}>
          <span className="eyebrow mb-3 block">{eyebrow}</span>
          <h2 className="text-3xl md:text-4xl mb-4">{title}</h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}

function ClubBand({
  href,
  image,
  kicker,
  title,
  body,
}: {
  href: string;
  image: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="relative block min-h-[320px] md:min-h-[420px] overflow-hidden group"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,12,16,0.1) 0%, rgba(5,12,16,0.78) 100%)",
        }}
      />
      <div className="relative flex h-full min-h-[320px] md:min-h-[420px] items-end p-8 md:p-12">
        <div className="max-w-md">
          <span
            className="block text-xs font-bold uppercase tracking-[0.22em] mb-3"
            style={{ color: "var(--sea)" }}
          >
            {kicker}
          </span>
          <h2
            className="text-3xl md:text-4xl text-white mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          <p
            className="text-sm md:text-base"
            style={{ color: "rgba(255,250,240,.8)" }}
          >
            {body}
          </p>
        </div>
      </div>
    </Link>
  );
}

function NewDrop() {
  const { data: products = [], isLoading } =
    trpc.commerce.products.list.useQuery({ first: 100 });
  const featured = products
    .filter(product => product.images.length)
    .slice(0, 8);
  return (
    <section className="container py-14 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow mb-2 block">The drop</span>
          <h2 className="text-3xl md:text-4xl">Wear the weekend</h2>
        </div>
        <Link
          href="/collections/apparel"
          className="text-sm font-bold uppercase tracking-wider text-teal whitespace-nowrap"
        >
          Shop all &rarr;
        </Link>
      </div>
      {featured.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, index) => (
            <PostcardProductCard
              key={product.id}
              handle={product.handle}
              title={product.title}
              price={Number.parseFloat(product.priceRange.min.amount).toFixed(
                2
              )}
              imageUrls={cardImageUrls(product.images, index)}
              eager
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {isLoading ? "Loading the new drop…" : "New gear is on the way."}
        </p>
      )}
      <p className="mt-8 text-sm text-muted-foreground">{SHIPPING_SUMMARY}</p>
    </section>
  );
}

function Sections() {
  return (
    <section className="border-t border-border/60 bg-card">
      <div className="container py-14 md:py-20">
        <h2 className="text-3xl md:text-4xl mb-3">
          Shop by the life, not the aisle
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Men&apos;s Club and Women&apos;s Club share the unisex pieces. They do
          not share the mood.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CUSTOMER_NAV_SECTIONS.map(section => (
            <Link
              key={section.handle}
              href={`/collections/${section.handle}`}
              className="block rounded-2xl p-6 transition-transform hover:-translate-y-1"
              style={{
                background: "linear-gradient(160deg, #0f3a3d 0%, #071417 100%)",
              }}
            >
              <span
                className="block text-xs font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "var(--sea)" }}
              >
                {section.subtitle}
              </span>
              <span
                className="block text-lg font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {section.title}
              </span>
              <span
                className="block text-sm"
                style={{ color: "rgba(255,250,240,.65)" }}
              >
                {section.tagline}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
