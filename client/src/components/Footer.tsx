import { Link } from "wouter";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative" style={{ background: "var(--ink)" }}>
      {/* Top accent */}
      <div className="h-[3px] wave-accent" />

      <div className="container py-16 md:py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--sea) 100%)" }}
              >
                <span className="text-white font-bold text-xs" style={{ fontFamily: "var(--font-display)" }}>WK</span>
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.03em" }}>
                Wet Kitty
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255, 250, 240, 0.6)" }}>
              Stay Salty. Ride Free. Life's Better Wet.<br />
              Premium coastal lifestyle apparel for the riders, the beach lovers, and the good-time chasers.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(21, 154, 153, 0.15)" }}
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" style={{ color: "var(--sea)" }} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(21, 154, 153, 0.15)" }}
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" style={{ color: "var(--sea)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(21, 154, 153, 0.15)" }}
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" style={{ color: "var(--sea)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2">
            <h4
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: "var(--sand)" }}
            >
              Shop
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Men", href: "/collections/men" },
                { label: "Women", href: "/collections/women" },
                { label: "Hats", href: "/collections/hats" },
                { label: "Hoodies", href: "/collections/hoodies" },
                { label: "Beach", href: "/collections/beach" },
                { label: "Limited Drop", href: "/collections/limited-drop" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm transition-colors duration-200"
                  style={{ color: "rgba(255, 250, 240, 0.6)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sea)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 250, 240, 0.6)")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Community Links */}
          <div className="md:col-span-3">
            <h4
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: "var(--sand)" }}
            >
              Community
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Join the Crew", href: "/community" },
                { label: "Beach Rally Events", href: "/events" },
                { label: "Loyalty Rewards", href: "/rewards" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm transition-colors duration-200"
                  style={{ color: "rgba(255, 250, 240, 0.6)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sea)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 250, 240, 0.6)")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Links */}
          <div className="md:col-span-3">
            <h4
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: "var(--sand)" }}
            >
              Support
            </h4>
            <nav className="flex flex-col gap-3">
              {["Shipping & Returns", "FAQ", "Privacy Policy", "Terms of Service", "Contact"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "rgba(255, 250, 240, 0.6)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sea)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 250, 240, 0.6)")}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(121, 212, 205, 0.1)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255, 250, 240, 0.4)" }}>
            &copy; {new Date().getFullYear()} Wet Kitty Apparel. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(255, 250, 240, 0.4)" }}>
            Powered by Shopify &amp; Printful
          </p>
        </div>
      </div>
    </footer>
  );
}
