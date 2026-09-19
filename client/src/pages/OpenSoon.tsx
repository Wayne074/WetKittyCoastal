import { Link } from "wouter";
import { Waves } from "lucide-react";

/**
 * Soft-close stand-in for catalog, PDP, and cart while SHOP_OPEN is false.
 * Keeps Founding Crew and home reachable.
 */
export default function OpenSoon() {
  return (
    <div className="min-h-[70vh] bg-background">
      <section className="border-b border-border/60 bg-card">
        <div className="container py-12 md:py-16 text-center max-w-2xl mx-auto">
          <span className="eyebrow mb-3 block text-teal">Shop status</span>
          <h1
            className="text-3xl md:text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Opening Soon
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Salt in the air, throttle on the horizon — we&apos;re dialing in the
            gear and graphics before we throw the doors open. Hang tight, Kitty.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 md:p-10 text-center shadow-sm">
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--teal) 0%, var(--sea) 100%)",
            }}
          >
            <Waves className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <h2 className="mb-3 text-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Merch shop is closed for now
          </h2>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Catalog, product pages, and cart are parked while we finish the drop.
            Founding Crew is still rolling — claim your spot if you&apos;re in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/founding-crew" className="btn btn-primary">
              Join Founding Crew
            </Link>
            <Link href="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
