import { useState } from "react";
import { Users, Camera, Star, Gift, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { WaveSeparator } from "@/components/brand";
import { trpc } from "@/lib/trpc";

export default function Community() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.features.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Welcome to the crew! Check your email for confirmation.");
      setEmail("");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #040a0e 0%, #0a2530 30%, #0d3a4a 50%, #0a2530 70%, #040a0e 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(21, 154, 153, 0.15) 0%, transparent 60%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />

        <div className="container relative z-10 py-20 text-center">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block" style={{ color: "var(--sea)" }}>
            Community
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-editorial)", lineHeight: 1.1 }}
          >
            Join the Crew
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "rgba(255, 250, 240, 0.65)" }}
          >
            We're more than a brand — we're a tribe of beach lovers, bikers, and good-time chasers.
          </p>

          {/* Signup Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3 rounded-full text-sm bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:border-sea/60 focus:outline-none transition-colors"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Join the Crew
              </button>
            </form>
          ) : (
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
              style={{ background: "rgba(21, 154, 153, 0.15)", color: "var(--sea)" }}
            >
              You're in! Welcome to the crew. 🤙
            </div>
          )}
        </div>
      </section>

      <WaveSeparator />

      {/* ─── BENEFITS ─── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-14">
            <span className="eyebrow mb-3 block">Perks</span>
            <h2 className="display-md text-foreground">Member Benefits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Gift, title: "Exclusive Drops", desc: "Early access to limited edition releases before anyone else." },
              { icon: Star, title: "Loyalty Rewards", desc: "Earn points on every purchase and unlock tier-based perks." },
              { icon: Camera, title: "Community Gallery", desc: "Share your lifestyle photos and get featured on our site." },
              { icon: Users, title: "Rally Invites", desc: "VIP access to Beach Rally events and meetups." },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl p-7 transition-all duration-300 hover:shadow-lg border border-border/50 bg-card"
                style={{ transitionTimingFunction: "var(--ease-out)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(21, 154, 153, 0.08)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "var(--teal)" }} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY GALLERY ─── */}
      <section className="section" style={{ background: "rgba(21, 154, 153, 0.03)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Gallery</span>
            <h2 className="display-md text-foreground">The Crew in Action</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Share your Wet Kitty lifestyle photos and get featured. Tag us @wetkittyapparel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(${135 + i * 20}deg, rgba(21, 154, 153, 0.06) 0%, rgba(121, 212, 205, 0.1) 50%, rgba(216, 195, 155, 0.06) 100%)`,
                  border: "1px solid rgba(21, 154, 153, 0.08)",
                }}
              >
                <Camera className="w-6 h-6 text-muted-foreground/30" />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="btn btn-primary">
              <Camera className="w-4 h-4 mr-2" /> Submit Your Photo
            </button>
          </div>
        </div>
      </section>

      <WaveSeparator />

      {/* ─── LOYALTY TIERS ─── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-14">
            <span className="eyebrow mb-3 block">Rewards</span>
            <h2 className="display-md text-foreground">Loyalty Tiers</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Earn points on every purchase and level up for better perks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                name: "Bronze",
                icon: Zap,
                points: "0–499 pts",
                color: "#cd7f32",
                perks: ["5% off next order", "Early access to sales", "Birthday reward"],
              },
              {
                name: "Silver",
                icon: Star,
                points: "500–1,499 pts",
                color: "#a0a0a0",
                perks: ["10% off next order", "Free shipping", "Exclusive drops access", "Double points days"],
              },
              {
                name: "Gold",
                icon: Crown,
                points: "1,500+ pts",
                color: "var(--sand)",
                perks: ["15% off next order", "Free shipping always", "VIP event access", "Custom embroidery credit", "Personal stylist"],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-7 border border-border/50 bg-card text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${tier.color}15` }}
                >
                  <tier.icon className="w-5 h-5" style={{ color: tier.color }} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {tier.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">
                  {tier.points}
                </p>
                <ul className="space-y-2.5 text-left">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: tier.color }} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
