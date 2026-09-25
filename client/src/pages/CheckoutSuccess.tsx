import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle2, Mail, PackageCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { EmailLink } from "./Info";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] bg-background">
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
          <CheckCircle2 className="mx-auto mb-6 h-14 w-14 text-teal" />
          <span className="eyebrow mb-3 block">Payment received</span>
          <h1 className="mb-4 text-3xl md:text-5xl">
            Your Wet Kitty gear is on the way.
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Stripe has securely processed your payment. Your order is now
            being made and will ship as soon as it's ready.
          </p>
          <div className="mb-8 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-xl bg-muted/60 p-4">
              <Mail className="mb-2 h-5 w-5 text-teal" />
              <strong className="block">Check your email</strong>
              <span className="text-sm text-muted-foreground">
                Stripe will send your payment receipt.
              </span>
            </div>
            <div className="rounded-xl bg-muted/60 p-4">
              <PackageCheck className="mb-2 h-5 w-5 text-teal" />
              <strong className="block">Made to order</strong>
              <span className="text-sm text-muted-foreground">
                Each piece is printed for you, then shipped.
              </span>
            </div>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">
            Most orders arrive in about 5–12 business days. Questions? Email <EmailLink />.
          </p>
          <Link href="/collections/apparel" className="btn btn-primary">
            Keep Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
