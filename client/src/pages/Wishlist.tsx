import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { PawLoader, WaveSeparator } from "@/components/brand";

export default function Wishlist() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addItem } = useCart();

  const { data: wishlistItems = [], isLoading, refetch } = trpc.features.wishlist.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const removeMutation = trpc.features.wishlist.remove.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Removed from wishlist");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PawLoader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <section className="relative min-h-[50vh] flex items-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, #0a0a0e 0%, #1a1520 40%, #2a1a2a 60%, #1a1520 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(216, 195, 155, 0.06) 0%, transparent 50%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />

          <div className="container relative z-10 py-20 text-center">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(216, 195, 155, 0.1)", border: "1px solid rgba(216, 195, 155, 0.15)" }}
            >
              <Heart className="w-8 h-8" style={{ color: "var(--sand)" }} />
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              Your Wishlist
            </h1>
            <p className="text-sm mb-8" style={{ color: "rgba(255, 250, 240, 0.6)" }}>
              Sign in to save your favorite items across sessions.
            </p>
            <a
              href={getLoginUrl()}
              className="btn btn-primary inline-flex"
            >
              Sign In
            </a>
          </div>
        </section>
        <WaveSeparator />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(21, 154, 153, 0.06)", border: "1px solid rgba(21, 154, 153, 0.1)" }}
            >
              <Heart className="w-5 h-5" style={{ color: "var(--teal)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Your Wishlist
              </h1>
              <p className="text-sm text-muted-foreground">
                {wishlistItems.length} saved {wishlistItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <PawLoader size="lg" />
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(21, 154, 153, 0.06)" }}
              >
                <Heart className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Your wishlist is empty
              </h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                Browse our collections and tap the heart icon to save your favorite items here.
              </p>
              <a href="/collections/men" className="btn btn-primary inline-flex">
                Browse Collections
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {wishlistItems.map((item: any) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div
                    className="aspect-square flex items-center justify-center relative"
                    style={{
                      background: "linear-gradient(135deg, rgba(21, 154, 153, 0.06) 0%, rgba(121, 212, 205, 0.08) 100%)",
                    }}
                  >
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productTitle || ""} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold" style={{ color: "var(--teal)", fontFamily: "var(--font-display)" }}>WK</span>
                    )}
                    <button
                      onClick={() => removeMutation.mutate({ productHandle: item.productId })}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-foreground mb-1 truncate" style={{ fontFamily: "var(--font-display)" }}>
                      {item.productTitle || "Product"}
                    </h3>
                    {item.productPrice && (
                      <p className="text-sm font-semibold mb-3" style={{ color: "var(--teal)" }}>${item.productPrice}</p>
                    )}
                    <button
                      onClick={() => {
                        if (item.variantId) addItem(item.variantId, 1);
                        toast.success("Added to cart!");
                      }}
                      className="btn btn-primary w-full text-xs py-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
