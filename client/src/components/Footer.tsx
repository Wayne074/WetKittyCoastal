import { Link } from "wouter";
import { SHOP_OPEN } from "@/const";
import { SHOP_SECTIONS } from "@shared/commerce/sections";

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
            <a href="mailto:bigcat@wetkittycoastal.com" className="text-sm font-semibold" style={{ color: "var(--sea)" }}>
              bigcat@wetkittycoastal.com
            </a>
          </div>

          {/* Shop Links — hidden while soft-closed */}
          {SHOP_OPEN && (
          <div className="md:col-span-2">
            <h4
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: "var(--sand)" }}
            >
              Shop
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Shop All", href: "/collections/apparel" },
                ...SHOP_SECTIONS.map(section => ({
                  label: section.navLabel,
                  href: `/collections/${section.handle}`,
                })),
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
          )}

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
                { label: "Founding Crew", href: "/founding-crew" },
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
              {[
                { label: "Shipping", href: "/shipping" },
                { label: "Returns", href: "/returns" },
                { label: "FAQ", href: "/faq" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(item => (
                <Link key={item.href} href={item.href} className="text-sm transition-colors duration-200 hover:text-[var(--sea)]" style={{ color: "rgba(255, 250, 240, 0.6)" }}>
                  {item.label}
                </Link>
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
            &copy; {new Date().getFullYear()} Wet Kitty Coastal. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(255, 250, 240, 0.4)" }}>
            Inspired by and born in Panama City Beach
          </p>
        </div>
      </div>
    </footer>
  );
}
