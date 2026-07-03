import { Link } from "wouter";
import { Heart, ShoppingBag } from "lucide-react";

interface PostcardProductCardProps {
  handle: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  imageUrl?: string;
  tags?: string[];
}

/**
 * Postcard-style product card — feels like a souvenir from the coast.
 * Rounded corners, subtle rotation on hover, stamp-like price badge.
 */
export default function PostcardProductCard({
  handle,
  title,
  price,
  compareAtPrice,
  imageUrl,
  tags = [],
}: PostcardProductCardProps) {
  const isLimited = tags.some((t) => t.toLowerCase().includes("limited"));
  const isNew = tags.some((t) => t.toLowerCase().includes("new"));

  return (
    <Link href={`/products/${handle}`}>
      <article className="group relative cursor-pointer">
        {/* Card body */}
        <div
          className="relative overflow-hidden rounded-2xl transition-all duration-500"
          style={{
            boxShadow: "0 4px 20px rgba(7, 16, 20, 0.08), 0 1px 4px rgba(7, 16, 20, 0.04)",
            transitionTimingFunction: "var(--ease-out)",
          }}
        >
          {/* Image area */}
          <div className="aspect-[4/5] overflow-hidden relative bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ transitionTimingFunction: "var(--ease-out)" }}
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(160deg, rgba(21, 154, 153, 0.08) 0%, rgba(121, 212, 205, 0.12) 50%, rgba(216, 195, 155, 0.08) 100%)",
                }}
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(21, 154, 153, 0.1)" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal/60">
                      <path d="M12 15c-3 0-6-2-6-5s3-5 6-5 6 2 6 5-3 5-6 5z" />
                      <circle cx="8" cy="6" r="1.5" />
                      <circle cx="12" cy="4.5" r="1.5" />
                      <circle cx="16" cy="6" r="1.5" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                    Wet Kitty
                  </span>
                </div>
              </div>
            )}

            {/* Hover overlay with quick actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-4 h-4 text-ink" />
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  aria-label="Quick add to cart"
                >
                  <ShoppingBag className="w-4 h-4 text-ink" />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {isLimited && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: "var(--ink)" }}
                >
                  Limited
                </span>
              )}
              {isNew && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: "var(--teal)" }}
                >
                  New
                </span>
              )}
            </div>
          </div>

          {/* Card footer — the "postcard" feel */}
          <div className="p-4 bg-card border-t border-border/50">
            <h3
              className="text-sm font-bold text-foreground mb-1 line-clamp-1 group-hover:text-teal transition-colors duration-300"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">
                ${price}
              </span>
              {compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${compareAtPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subtle card lift on hover */}
        <style>{`
          .group:hover > div:first-child {
            transform: translateY(-6px);
            box-shadow: 0 12px 40px rgba(7, 16, 20, 0.12), 0 4px 12px rgba(7, 16, 20, 0.06) !important;
          }
        `}</style>
      </article>
    </Link>
  );
}
