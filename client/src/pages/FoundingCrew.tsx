import { ArrowRight, BadgeCheck, Crown, Megaphone, Shirt, Tag, UserRound } from "lucide-react";

const foundingCrewPaymentUrl =
  import.meta.env.VITE_FOUNDING_CREW_PAYMENT_URL ||
  "https://buy.stripe.com/14AbJ17FYatPh2718OfAc00";

export default function FoundingCrew() {
  const benefits = [
    { icon: BadgeCheck, title: "Numbered Founding Crew Status", text: "Claim one of only 1,500 numbered spots, permanently tied to your Founding Crew membership." },
    { icon: Crown, title: "Early Access", text: "Get first access to selected new drops and Founding Crew announcements." },
    { icon: Tag, title: "Founding Crew Discount", text: "Enjoy a special discount on selected Wet Kitty drops as the brand grows." },
    { icon: Megaphone, title: "Show Merch First Dibs", text: "Be first in line for limited show merch and other small-batch releases." },
    { icon: UserRound, title: "Name on the Wall", text: "Put your name or nickname on the Founding Crew Wall as part of the original 1,500." },
    { icon: Shirt, title: "Work Shirt Opportunity", text: "Get the opportunity to purchase a premium Founding Crew button-up with patches or embroidery." },
  ];

  return (
    <div className="min-h-screen bg-[#f5efe4] text-[#071417]">
      <section className="relative overflow-hidden bg-[#071417] px-6 py-24 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(62,201,197,.18),transparent_48%)]" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#54d6d1]">The Original 1500</p>
          <h1 className="font-serif text-5xl font-bold uppercase leading-none md:text-7xl">Founding Crew</h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/75">
            Wet Kitty is still at the beginning. The Founding Crew is for the first 1,500 people who choose to help build the brand before the rest of the world discovers it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm">
              <Icon className="mb-5 h-8 w-8 text-[#159a99]" />
              <h2 className="mb-3 text-lg font-extrabold uppercase tracking-wide">{title}</h2>
              <p className="leading-7 text-black/65">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-[#0b1e22] p-8 text-white md:p-12">
          <h2 className="font-serif text-3xl font-bold uppercase md:text-5xl">Join the first 1,500.</h2>
          <p className="mt-5 max-w-3xl leading-8 text-white/70">
            Join the Wet Kitty Founding Crew for $147 and claim your numbered status, early access, Founding Crew discount, show merch first dibs, and a place on the Founding Crew Wall. Membership is capped at 1,500 total members.
          </p>
          <a
            href={foundingCrewPaymentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded bg-[#3ec9c5] px-6 py-4 font-extrabold uppercase tracking-wider text-[#071417]"
          >
            Join Founding Crew for $147 <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
