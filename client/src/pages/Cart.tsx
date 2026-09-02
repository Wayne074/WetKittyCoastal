import { Link } from "wouter";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const { cart, itemCount, loading, updateQuantity, removeItem, proceedToCheckout } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-card">
        <div className="container py-12 md:py-16">
          <span className="eyebrow mb-3 block">Your order</span>
          <h1 className="text-3xl md:text-5xl">Shopping Cart</h1>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        {loading ? (
          <p className="text-muted-foreground">Loading your cart…</p>
        ) : !cart || itemCount === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-5 h-10 w-10 text-teal" />
            <h2 className="mb-2 text-2xl">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">Find something made for beach days, bike nights, or both.</p>
            <Link href="/collections/apparel" className="btn btn-primary">Shop Tees, Tanks &amp; Hoodies</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cart.items.map(item => (
                <article key={item.lineId} className="flex gap-4 rounded-2xl border border-border bg-card p-4 md:p-5">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted md:h-32 md:w-32">
                    {item.image ? (
                      <img src={item.image.url} alt={item.image.altText || item.productTitle} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center font-bold text-teal">WK</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link href={`/products/${item.productHandle}`} className="font-bold text-foreground hover:text-teal">
                          {item.productTitle}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">{item.variantTitle}</p>
                      </div>
                      <button type="button" onClick={() => removeItem(item.lineId)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Remove ${item.productTitle}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-lg border border-border">
                        <button type="button" onClick={() => updateQuantity(item.lineId, Math.max(0, item.quantity - 1))} className="p-2.5 hover:bg-muted" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                        <span className="min-w-10 text-center font-semibold">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="p-2.5 hover:bg-muted" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                      </div>
                      <strong>{formatMoney(item.lineTotal)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-xl">Order Summary</h2>
              <div className="flex justify-between border-b border-border pb-4 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <strong>{formatMoney(cart.subtotal)}</strong>
              </div>
              <p className="my-4 text-sm text-muted-foreground">Shipping and any applicable tax are calculated during Stripe checkout.</p>
              <div className="mb-5 flex justify-between border-t border-border pt-4">
                <span className="font-bold">Total</span>
                <strong className="text-lg text-teal">{formatMoney(cart.total)}</strong>
              </div>
              <button type="button" onClick={proceedToCheckout} className="btn btn-primary w-full">Secure Checkout</button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Payments processed securely by Stripe.</p>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
