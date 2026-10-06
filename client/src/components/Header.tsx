import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { SHOP_OPEN } from "@/const";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Founding Crew", href: "/founding-crew" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => location === href;

  return (
    <div className="relative z-50 shrink-0 bg-[#071417] text-[#f6efe4]">
      {!SHOP_OPEN && (
        <div
          className="text-center px-4 py-2 text-sm font-semibold tracking-wide"
          style={{
            background: "linear-gradient(90deg, var(--teal) 0%, var(--sea) 100%)",
            color: "#061416",
          }}
          role="status"
        >
          Shop Opening Soon — dialing in products &amp; graphics.{" "}
          <Link
            href="/founding-crew"
            className="inline-flex items-center justify-center ml-1.5 px-3 py-1 rounded-full bg-[#061416] text-[#7fd8d4] text-xs font-extrabold uppercase tracking-wide no-underline hover:bg-black transition-colors"
          >
            Founding Crew is live
          </Link>
        </div>
      )}

      <header className="border-b border-white/10">
        <div className="container">
          <div className="flex items-center justify-between gap-3 h-[64px] md:h-[84px]">
            <Link href="/" className="flex items-center shrink-0" aria-label="Wet Kitty Coastal home">
              <img
                src="/images/brand/wet-kitty-mark.png"
                alt="Wet Kitty Coastal"
                className="h-12 md:h-16 w-auto"
              />
            </Link>

            <nav className="hidden xl:flex items-center justify-end gap-0.5 min-w-0" aria-label="Main navigation">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-2 rounded text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap transition-colors ${
                    isActive(item.href) ? "text-[#7fd8d4]" : "text-[#f6efe4]/90 hover:text-[#7fd8d4]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <Link
                href="/cart"
                className="p-2.5 rounded-lg hover:bg-white/10 transition-colors relative"
                aria-label={`Shopping cart${itemCount ? `, ${itemCount} items` : ""}`}
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span
                    className="absolute top-1 right-1 min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full flex items-center justify-center text-[#061416]"
                    style={{ background: "#49d3cf" }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[720px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="border-t border-white/10" aria-label="Mobile navigation">
            <div className="container py-3 space-y-1">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded text-sm font-bold uppercase tracking-[0.08em] ${
                    isActive(item.href) ? "text-[#7fd8d4]" : "text-[#f6efe4]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
