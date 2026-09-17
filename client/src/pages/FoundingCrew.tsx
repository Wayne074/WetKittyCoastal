import {
  ArrowRight,
  CreditCard,
  Lock,
  Percent,
  Shirt,
  Sparkles,
  Star,
  Sticker,
  Tag,
  Users,
} from "lucide-react";

/** Hostinger / deploy can override via VITE_FOUNDING_CREW_SOLD (number string). */
const FOUNDING_CREW_SOLD = 0;
const FOUNDING_CREW_CAP = 1500;

const foundingCrewPaymentUrl =
  import.meta.env.VITE_FOUNDING_CREW_PAYMENT_URL ||
  "https://buy.stripe.com/14AbJ17FYatPh2718OfAc00";

function parseSold(): number {
  const fromEnv = import.meta.env.VITE_FOUNDING_CREW_SOLD;
  if (fromEnv !== undefined && fromEnv !== "") {
    const n = Number(fromEnv);
    if (Number.isFinite(n) && n >= 0) return Math.min(Math.floor(n), FOUNDING_CREW_CAP);
  }
  return FOUNDING_CREW_SOLD;
}

function formatSpots(n: number): string {
  return n.toLocaleString("en-US");
}

const kitItems = [
  {
    icon: Shirt,
    title: "Exclusive Founding Crew T-Shirt",
    detail: "Never sold to the public",
  },
  {
    icon: CreditCard,
    title: "Numbered NFC Membership Card",
    detail: "Your permanent Founding Crew number",
  },
  {
    icon: Tag,
    title: "Founding Crew Patch",
    detail: "Wear it on the road",
  },
  {
    icon: Sticker,
    title: "Wet Kitty Bumper Sticker",
    detail: "Same sand. Different breed.",
  },
];

const plusItems = [
  {
    icon: Star,
    text: "Your name on the Founding Crew Wall (on the side of the show rig)",
  },
  {
    icon: Percent,
    text: "Permanent Founding Crew discount",
  },
  {
    icon: Lock,
    text: "Early access to selected drops",
  },
  {
    icon: Sparkles,
    text: "Access to member-only merchandise and opportunities",
  },
  {
    icon: Users,
    text: "A real role in helping build what's next",
  },
];

export default function FoundingCrew() {
  const sold = parseSold();
  const remaining = Math.max(0, FOUNDING_CREW_CAP - sold);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-white/10"
        aria-labelledby="founding-crew-hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(8,10,12,.55) 0%, rgba(8,10,12,.72) 45%, rgba(8,10,12,.95) 100%), url('/founding-crew/hero-band-crop.png')",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(62,201,197,.18),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pb-16 pt-14 text-center sm:px-8 sm:pb-20 sm:pt-18 md:pt-20">
          <p
            className="mb-6 font-[family-name:var(--fc-script)] text-lg italic tracking-wide text-[#3ec9c5] sm:absolute sm:right-8 sm:top-10 sm:mb-0 sm:text-xl md:right-12 md:top-12"
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            Salty People Do It Better™
          </p>

          <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.35em] text-white/80 sm:text-xs">
            Beach • Boats • Good Times
          </p>

          <p className="mb-2 font-[family-name:var(--font-display)] text-5xl font-extrabold uppercase leading-none tracking-tight text-white drop-shadow-[0_0_18px_rgba(62,201,197,.35)] sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="relative inline-block">
              Wet Kitty
              <span
                className="absolute -top-1 left-[72%] text-[#3ec9c5] sm:-top-2"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current sm:h-5 sm:w-5 md:h-6 md:w-6"
                >
                  <path d="M12 18c-1.2 0-2.2-.5-2.9-1.3-.4.2-.9.3-1.4.3-1.7 0-3-1.3-3-3 0-.4.1-.8.2-1.1C4.3 12.5 4 11.8 4 11c0-1.4 1-2.5 2.3-2.8.2-1.6 1.5-2.8 3.2-2.8.6 0 1.1.2 1.6.4C11.6 5.3 12.3 5 13 5c1.1 0 2 .6 2.5 1.5.5-.3 1.1-.5 1.7-.5 1.7 0 3 1.3 3 3 0 .3 0 .5-.1.8 1.1.4 1.9 1.5 1.9 2.7 0 .9-.4 1.7-1.1 2.2.1.3.1.6.1.9 0 1.7-1.3 3-3 3-.5 0-1-.1-1.4-.3C14.2 17.5 13.2 18 12 18z" />
                </svg>
              </span>
            </span>
          </p>

          <h1
            id="founding-crew-hero"
            className="mt-8 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: '"Anton", Impact, sans-serif',
              textShadow:
                "0 0 2px #3ec9c5, 0 0 12px rgba(62,201,197,.55), 0 0 28px rgba(62,201,197,.25)",
            }}
          >
            The Original 1,500
          </h1>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.28em] text-white/90 sm:text-base">
            Same Sand <span className="text-[#3ec9c5]" aria-hidden="true">·</span> Different Breed
          </p>
          <p className="mt-3 text-base font-extrabold uppercase tracking-[0.22em] text-[#3ec9c5] sm:text-lg">
            Founding Crew
          </p>
        </div>
      </section>

      {/* ── Three-column story ───────────────────────────────── */}
      <section
        className="border-b border-white/10 bg-[#0c0e10] px-5 py-14 sm:px-8 sm:py-18 md:py-20"
        aria-labelledby="founding-story"
      >
        <h2 id="founding-story" className="sr-only">
          Why the Founding Crew exists
        </h2>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          <article>
            <h3 className="mb-4 text-lg font-extrabold uppercase italic leading-snug tracking-wide text-[#3ec9c5] sm:text-xl">
              Every big thing starts somewhere.
            </h3>
            <p className="text-[0.95rem] leading-7 text-white/80">
              Wet Kitty didn&apos;t start in a boardroom. There&apos;s no giant
              company behind it, no massive ad budget, and no investors throwing
              millions at it. It started with an idea, a little nerve, and a
              decision to take one real shot at building something from the
              ground up.{" "}
              <strong className="font-bold text-white">This is that shot.</strong>{" "}
              No safety net. No guarantees. Just good people, good times, and a
              name that&apos;s hard as hell to forget.
            </p>
          </article>

          <article>
            <p className="text-[0.95rem] leading-7 text-white/80">
              The Founding Crew is for the first 1,500 people willing to take
              this ride with us. The people who wore Wet Kitty when somebody
              still had to ask, &ldquo;What the hell is Wet Kitty?&rdquo; If
              this becomes what we believe it can become, someday Wet Kitty
              might be a name you see on beaches, boats, bikes and backroads
              everywhere.{" "}
              <strong className="font-bold text-white">
                But there will never be another original 1,500.
              </strong>{" "}
              Your number is yours. Your place in the Founding Crew is
              permanent. And years from now, wherever this thing ends up,
              you&apos;ll always be able to say:
            </p>
            <p
              className="mt-5 text-lg font-bold italic leading-snug text-[#3ec9c5] sm:text-xl"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              &ldquo;Yeah. I was there before everybody knew about it.&rdquo;
            </p>
          </article>

          <article>
            <h3 className="mb-4 text-lg font-extrabold uppercase leading-snug tracking-wide text-[#3ec9c5] sm:text-xl">
              More than a membership. A real thank you.
            </h3>
            <p className="text-[0.95rem] leading-7 text-white/80">
              As a special thank you to the Original 1,500, we&apos;re dedicating
              one entire side of our Wet Kitty show rig to the Founding Crew.
              Your name or nickname will be on the road with us — on the side of
              the trailer — for everyone to see at every beach event, bike show,
              boat show, rally and everywhere else we go. When that rig rolls
              down the highway, the people who helped make it happen will be
              riding with us.
            </p>
            <p
              className="mt-6 inline-block max-w-full px-4 py-3 text-center text-sm font-black uppercase tracking-wider text-[#071417] sm:text-base"
              style={{
                background:
                  "linear-gradient(135deg, #2bb8b4 0%, #3ec9c5 50%, #5ad9d4 100%)",
                clipPath:
                  "polygon(2% 8%, 98% 0%, 100% 92%, 4% 100%, 0% 18%)",
              }}
            >
              Your name goes where we go.
            </p>
          </article>
        </div>
      </section>

      {/* ── Artist rendering ─────────────────────────────────── */}
      <section
        className="border-b border-white/10 bg-[#080a0c] px-5 py-14 sm:px-8 sm:py-16"
        aria-labelledby="trailer-rendering"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="trailer-rendering"
            className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-[#3ec9c5] sm:text-sm"
          >
            Founding Crew Wall — Show Rig
          </h2>
          <figure>
            <img
              src="/founding-crew/trailer-rendering-crop.png"
              alt="Artist rendering of the Wet Kitty show trailer with Founding Crew name wall"
              className="w-full rounded-sm border border-white/10 object-cover shadow-[0_0_40px_rgba(62,201,197,.12)]"
              loading="lazy"
              width={1600}
              height={900}
            />
            <figcaption className="mt-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/55">
              Artist rendering — final design may vary
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Kit ──────────────────────────────────────────────── */}
      <section
        className="border-b border-white/10 bg-[#0c0e10] px-5 py-14 sm:px-8 sm:py-18 md:py-20"
        aria-labelledby="founding-kit"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2
              id="founding-kit"
              className="text-3xl font-black uppercase tracking-tight text-[#3ec9c5] sm:text-4xl md:text-5xl"
              style={{ fontFamily: '"Anton", Impact, sans-serif' }}
            >
              Your Founding Crew Kit
            </h2>
            <p className="mt-3 text-base font-extrabold uppercase tracking-[0.18em] text-[#3ec9c5] sm:text-lg">
              $147 One Time — No Monthly Fees
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="grid gap-4 sm:grid-cols-2">
              {kitItems.map(({ icon: Icon, title, detail }) => (
                <article
                  key={title}
                  className="rounded-xl border border-[#3ec9c5]/25 bg-[#111416] p-5 shadow-[inset_0_0_0_1px_rgba(62,201,197,.06)]"
                >
                  <Icon
                    className="mb-4 h-8 w-8 text-[#3ec9c5]"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-extrabold uppercase leading-snug tracking-wide text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{detail}</p>
                </article>
              ))}
            </div>

            <aside className="rounded-xl border border-[#3ec9c5]/35 bg-[#0f1416] p-6 sm:p-7">
              <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#3ec9c5]">
                Plus you get
              </h3>
              <ul className="space-y-4">
                {plusItems.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex gap-3">
                    <Icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#3ec9c5]"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-6 text-white/85">{text}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ── CTA + remaining ──────────────────────────────────── */}
      <section
        className="bg-[#080a0c] px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="claim-spot"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 id="claim-spot" className="sr-only">
            Claim your Founding Crew number
          </h2>

          <a
            href={foundingCrewPaymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex max-w-full items-center justify-center gap-2 px-6 py-5 text-center text-sm font-black uppercase tracking-wide text-[#071417] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3ec9c5] sm:px-10 sm:text-base md:text-lg"
            style={{
              background:
                "linear-gradient(135deg, #2bb8b4 0%, #3ec9c5 45%, #5ad9d4 100%)",
              clipPath:
                "polygon(1.5% 10%, 98.5% 0%, 100% 88%, 2% 100%, 0% 22%)",
              boxShadow: "0 0 32px rgba(62,201,197,.35)",
            }}
          >
            Claim My Founding Crew Number — $147
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </a>

          <div className="mt-8 inline-flex flex-col items-center gap-2 rounded-md border-2 border-[#3ec9c5]/70 px-6 py-4 sm:px-8">
            <p
              className="text-lg font-black uppercase tracking-[0.12em] text-white sm:text-xl"
              aria-live="polite"
            >
              {formatSpots(remaining)} of 1,500 spots remain
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3ec9c5] sm:text-sm">
              Once they&apos;re gone, they&apos;re gone.
            </p>
          </div>
        </div>
      </section>

      {/* ── Page footer strip (site Footer still wraps via App) ─ */}
      <div className="border-t border-white/10 bg-[#050607] px-5 py-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3ec9c5] sm:text-sm">
          Wet Kitty{" "}
          <span className="text-white/40" aria-hidden="true">
            |
          </span>{" "}
          Panama City Beach, FL{" "}
          <span className="text-white/40" aria-hidden="true">
            |
          </span>{" "}
          Same Sand. Different Breed.
        </p>
      </div>
    </div>
  );
}
