import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, Heart, ShoppingBag } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shopItems = [
    { label: "Men", href: "/collections/men" },
    { label: "Women", href: "/collections/women" },
    { label: "Hats", href: "/collections/hats" },
    { label: "Hoodies", href: "/collections/hoodies" },
    { label: "Beach", href: "/collections/beach" },
    { label: "Limited Drop", href: "/collections/limited-drop" },
  ];

  const communityItems = [
    { label: "Founding Crew", href: "/founding-crew" },
    { label: "About", href: "/community" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <>
      {/* Brand accent bar */}
      <div className="h-[3px] wave-accent" />

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border/50"
            : "bg-background border-b border-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--teal) 0%, var(--sea) 100%)",
                }}
              >
                <span className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                  WK
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg tracking-wide text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  Wet Kitty
                </div>
                <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  Beach &bull; Biker &bull; Apparel
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {shopItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-teal bg-teal/5"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-px h-5 bg-border mx-2" />
              {communityItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-teal bg-teal/5"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 active:scale-95"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-[18px] h-[18px] text-sand" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-foreground/60" />
                )}
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 active:scale-95 relative">
                <Heart className="w-[18px] h-[18px] text-foreground/60" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 active:scale-95 relative">
                <ShoppingBag className="w-[18px] h-[18px] text-foreground/60" />
                {itemCount > 0 && (
                  <span
                    className="absolute top-1 right-1 min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full flex items-center justify-center text-white"
                    style={{ background: "var(--teal)" }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 active:scale-95 ml-1"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ transitionTimingFunction: "var(--ease-out)" }}
        >
          <nav className="border-t border-border bg-card/95 backdrop-blur-md">
            <div className="container py-4 space-y-1">
              <p className="eyebrow px-4 py-2 text-muted-foreground">Shop</p>
              {shopItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-teal/10 text-teal"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="divider my-3" />
              <p className="eyebrow px-4 py-2 text-muted-foreground">Community</p>
              {communityItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-teal/10 text-teal"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
