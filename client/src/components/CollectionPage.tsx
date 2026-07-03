import { useState, useMemo, useEffect } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { WaveSeparator, PawLoader, PostcardProductCard } from "@/components/brand";

interface CollectionPageProps {
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  gradient: string;
  accent: string;
  seoTitle?: string;
  seoDescription?: string;
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const PRICE_RANGES = [
  { label: "Under $30", min: 0, max: 30 },
  { label: "$30 - $60", min: 30, max: 60 },
  { label: "$60 - $100", min: 60, max: 100 },
  { label: "Over $100", min: 100, max: 9999 },
];

export default function CollectionPage({
  handle,
  title,
  subtitle,
  description,
  tagline,
  gradient,
  accent,
  seoTitle,
  seoDescription,
}: CollectionPageProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);

  // SEO: Update document title and meta description
  useEffect(() => {
    const pageTitle = seoTitle || `${title} | Wet Kitty Apparel`;
    document.title = pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    const descContent = seoDescription || `${description} Shop the ${title} collection at Wet Kitty — premium coastal biker lifestyle apparel.`;
    if (metaDesc) {
      metaDesc.setAttribute("content", descContent);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = descContent;
      document.head.appendChild(meta);
    }
    // Open Graph
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setOg("og:title", pageTitle);
    setOg("og:description", descContent);
    setOg("og:type", "website");
    setOg("og:url", window.location.href);
  }, [title, description, seoTitle, seoDescription]);

  const { data: products = [], isLoading } = trpc.commerce.products.list.useQuery({
    first: 24,
    collectionHandle: handle,
  });

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Size filter
    if (sizeFilter) {
      result = result.filter((p: any) =>
        p.variants?.some((v: any) =>
          v.title?.toUpperCase().includes(sizeFilter) && v.availableForSale !== false
        )
      );
    }

    // Price filter
    if (priceFilter) {
      result = result.filter((p: any) => {
        const price = parseFloat(p.variants?.[0]?.price?.amount || "0");
        return price >= priceFilter.min && price <= priceFilter.max;
      });
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        return result.sort((a: any, b: any) => parseFloat(a.variants[0]?.price.amount || "0") - parseFloat(b.variants[0]?.price.amount || "0"));
      case "price-high":
        return result.sort((a: any, b: any) => parseFloat(b.variants[0]?.price.amount || "0") - parseFloat(a.variants[0]?.price.amount || "0"));
      case "title-az":
        return result.sort((a: any, b: any) => a.title.localeCompare(b.title));
      default:
        return result;
    }
  }, [products, sortBy, sizeFilter, priceFilter]);

  const activeFilterCount = (sizeFilter ? 1 : 0) + (priceFilter ? 1 : 0);

  return (
    <div className="min-h-screen">
      {/* ─── STORY HERO ─── Full-page intro that sets the mood */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: gradient }} />
        {/* Glow accent */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 70% 40%, ${accent}20 0%, transparent 55%)`,
          }}
        />
        {/* Palm leaf shadow */}
        <div
          className="absolute top-0 left-0 w-64 h-64 opacity-[0.06] pointer-events-none"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M20 180 C40 120 80 80 140 40 C100 90 70 130 50 170 Z' fill='%23159a99'/%3E%3Cpath d='M30 190 C60 140 100 100 160 60 C120 110 90 150 60 180 Z' fill='%2379d4cd'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
        />

        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-2xl">
            <span
              className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block"
              style={{ color: accent }}
            >
              {subtitle}
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-editorial)", lineHeight: 1.1, letterSpacing: "-0.01em" }}
            >
              {title}
            </h1>
            <p
              className="text-xl md:text-2xl font-medium mb-6"
              style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "rgba(255, 250, 240, 0.7)" }}
            >
              {tagline}
            </p>
            <p className="text-sm max-w-lg" style={{ color: "rgba(255, 250, 240, 0.5)", lineHeight: 1.7 }}>
              {description}
            </p>
          </div>
        </div>
      </section>

      <WaveSeparator />

      {/* ─── FILTER BAR ─── */}
      <section className="py-4 border-b border-border/50 sticky top-[72px] z-30 bg-background/95 backdrop-blur-md">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "var(--teal)" }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span className="text-sm text-muted-foreground">
                {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "product" : "products"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-medium bg-transparent border-none text-foreground focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title-az">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border/50 animate-fade-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Size Filter */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSizeFilter(sizeFilter === size ? null : size)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={{
                          border: sizeFilter === size ? "1.5px solid var(--teal)" : "1px solid var(--border)",
                          background: sizeFilter === size ? "rgba(21, 154, 153, 0.06)" : "transparent",
                          color: sizeFilter === size ? "var(--teal)" : "var(--foreground)",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Price</label>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setPriceFilter((priceFilter?.min === range.min && priceFilter?.max === range.max) ? null : range)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={{
                          border: priceFilter?.min === range.min && priceFilter?.max === range.max ? "1.5px solid var(--teal)" : "1px solid var(--border)",
                          background: priceFilter?.min === range.min && priceFilter?.max === range.max ? "rgba(21, 154, 153, 0.06)" : "transparent",
                          color: priceFilter?.min === range.min && priceFilter?.max === range.max ? "var(--teal)" : "var(--foreground)",
                        }}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setSizeFilter(null); setPriceFilter(null); }}
                  className="mt-3 flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: "var(--teal)" }}
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── PRODUCT GRID ─── */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <PawLoader size="lg" />
            </div>
          ) : filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredAndSorted.map((product: any) => (
                <PostcardProductCard
                  key={product.id}
                  handle={product.handle}
                  title={product.title}
                  price={product.variants?.[0]?.price?.amount || "0"}
                  compareAtPrice={product.variants?.[0]?.compareAtPrice?.amount}
                  imageUrl={product.images?.[0]?.url}
                  tags={product.tags || []}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(21, 154, 153, 0.08)" }}
              >
                <span className="text-2xl font-bold" style={{ color: "var(--teal)", fontFamily: "var(--font-display)" }}>WK</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                This collection is being curated. Join the Crew to get first access when it drops.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── JSON-LD Schema ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description: description,
            url: window.location.href,
            isPartOf: {
              "@type": "WebSite",
              name: "Wet Kitty Apparel",
              url: window.location.origin,
            },
          }),
        }}
      />
    </div>
  );
}
