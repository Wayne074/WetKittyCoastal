import { useState } from "react";
import { Heart, Share2, ShoppingBag, ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { PawLoader, WaveSeparator } from "@/components/brand";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:handle");
  const productId = params?.handle;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [embroideryEnabled, setEmbroideryEnabled] = useState(false);
  const [embroideryText, setEmbroideryText] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  const { data: product, isLoading } = trpc.commerce.products.byHandle.useQuery(
    { handle: productId || "" },
    { enabled: !!productId }
  );
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PawLoader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(21, 154, 153, 0.06)" }}
          >
            <span className="text-2xl font-bold" style={{ color: "var(--teal)", fontFamily: "var(--font-display)" }}>WK</span>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Product Not Found
          </h2>
          <p className="text-sm text-muted-foreground mb-6">This product may have been removed or the link is incorrect.</p>
          <a href="/collections/men" className="btn btn-primary inline-flex">Browse Collections</a>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const images = product.images || [];
  const currentImage = images[imageIndex];

  const handleAddToCart = () => {
    if (variant) {
      addItem(variant.id, quantity);
      toast.success(`Added ${quantity} to cart!`);
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border/50">
        <div className="container py-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/collections/men" className="hover:text-foreground transition-colors">Collections</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14">
          {/* ─── IMAGE GALLERY ─── */}
          <div className="space-y-3">
            <div
              className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(21, 154, 153, 0.04) 0%, rgba(121, 212, 205, 0.06) 50%, rgba(216, 195, 155, 0.04) 100%)",
                border: "1px solid rgba(21, 154, 153, 0.08)",
              }}
            >
              {currentImage ? (
                <img src={currentImage.url} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <span className="text-6xl font-bold" style={{ color: "var(--teal)", fontFamily: "var(--font-display)", opacity: 0.3 }}>WK</span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200"
                    style={{
                      border: idx === imageIndex ? "2px solid var(--teal)" : "1px solid var(--border)",
                      opacity: idx === imageIndex ? 1 : 0.6,
                    }}
                  >
                    <img src={img.url} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── PRODUCT INFO ─── */}
          <div>
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block"
              style={{ color: "var(--teal)" }}
            >
              Premium Apparel
            </span>
            <h1
              className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              style={{ fontFamily: "var(--font-editorial)", lineHeight: 1.2 }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-2xl font-bold" style={{ color: "var(--teal)" }}>
                ${variant?.price.amount}
              </span>
              <span className="text-xs text-muted-foreground uppercase">
                {variant?.price.currencyCode}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {product.description || "Premium quality apparel designed for the coastal lifestyle and biker culture. Made with care, built to last."}
            </p>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                  Size
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        border: idx === selectedVariant ? "2px solid var(--teal)" : "1px solid var(--border)",
                        background: idx === selectedVariant ? "rgba(21, 154, 153, 0.06)" : "transparent",
                        color: idx === selectedVariant ? "var(--teal)" : "var(--foreground)",
                      }}
                    >
                      {v.title || `Size ${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── EMBROIDERY ─── */}
            <div
              className="mb-6 p-5 rounded-xl transition-all duration-200"
              style={{
                border: embroideryEnabled ? "1px solid var(--teal)" : "1px solid var(--border)",
                background: embroideryEnabled ? "rgba(21, 154, 153, 0.03)" : "transparent",
              }}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                  style={{
                    background: embroideryEnabled ? "var(--teal)" : "transparent",
                    border: embroideryEnabled ? "none" : "2px solid var(--border)",
                  }}
                >
                  {embroideryEnabled && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground">Add Custom Embroidery</span>
                  <span className="text-xs text-muted-foreground ml-2">+$15.00</span>
                </div>
              </label>
              <input
                type="checkbox"
                checked={embroideryEnabled}
                onChange={(e) => setEmbroideryEnabled(e.target.checked)}
                className="sr-only"
              />
              {embroideryEnabled && (
                <div className="mt-4 pl-8">
                  <input
                    type="text"
                    placeholder="Enter text (max 20 characters)"
                    value={embroideryText}
                    onChange={(e) => setEmbroideryText(e.target.value.slice(0, 20))}
                    maxLength={20}
                    className="w-full px-4 py-2.5 text-sm border rounded-lg bg-background text-foreground focus:outline-none transition-colors"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Premium thread colors. Fulfilled by Printful embroidery.
                  </p>
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="mb-6">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                Quantity
              </label>
              <div className="flex items-center gap-1 mb-5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center font-bold text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                >
                  +
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-1"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    border: isWishlisted ? "2px solid var(--teal)" : "1px solid var(--border)",
                    background: isWishlisted ? "rgba(21, 154, 153, 0.06)" : "transparent",
                  }}
                >
                  <Heart
                    className="w-5 h-5 transition-colors"
                    style={{ color: isWishlisted ? "var(--teal)" : "var(--muted-foreground)" }}
                    fill={isWishlisted ? "var(--teal)" : "none"}
                  />
                </button>
                <button
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-border hover:bg-muted transition-colors"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="border-t border-border/50 pt-5 space-y-3">
              {[
                { icon: Truck, text: "Free shipping on orders over $100" },
                { icon: Shield, text: "Premium quality guaranteed" },
                { icon: RotateCcw, text: "30-day hassle-free returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--teal)" }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WaveSeparator />

      {/* ─── JSON-LD Schema for Google Shopping ─── */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              description: product.description,
              image: images.map((img: any) => img.url),
              brand: { "@type": "Brand", name: "Wet Kitty" },
              offers: {
                "@type": "Offer",
                price: variant?.price.amount,
                priceCurrency: variant?.price.currencyCode || "USD",
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "Wet Kitty Apparel" },
              },
            }),
          }}
        />
      )}
    </div>
  );
}
