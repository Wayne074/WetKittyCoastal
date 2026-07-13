import { Link } from "wouter";
import { BadgeCheck, Crown, Shirt, Vote, Ticket, ArrowRight } from "lucide-react";

export default function FoundingCrew() {
  const benefits = [
    { icon: BadgeCheck, title: "Permanent Member Number", text: "One of only 1,500 numbers, permanently tied to your Founding Crew membership." },
    { icon: Vote, title: "The Right to Vote", text: "Vote on selected future limited-edition designs when Founding Crew ballots are opened." },
    { icon: Crown, title: "Early Access", text: "Get first access to selected new drops and Founding Crew announcements." },
    { icon: Shirt, title: "Exclusive Work Shirt", text: "The opportunity to purchase one premium Founding Crew button-up with patches or embroidery." },
    { icon: Ticket, title: "Future Event Perks", text: "Founding Crew benefits at participating Wet Kitty events as the brand grows." },
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
          <h2 className="font-serif text-3xl font-bold uppercase md:text-5xl">Membership applications are coming soon.</h2>
          <p className="mt-5 max-w-3xl leading-8 text-white/70">
            Applications will ask for the name or nickname you want displayed on the Founding Crew Wall, your email, shirt size, city and state, and optionally why you want to join. Membership will be limited to 1,500 total members.
          </p>
          <Link href="/community" className="mt-8 inline-flex items-center gap-2 rounded bg-[#3ec9c5] px-6 py-4 font-extrabold uppercase tracking-wider text-[#071417]">
            Join the email list <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
