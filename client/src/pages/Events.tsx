import { useState } from "react";
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { WaveSeparator, PawLoader } from "@/components/brand";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// Fallback events shown when DB is empty
const fallbackEvents = [
  {
    id: 1,
    title: "Daytona Beach Rally 2026",
    date: "July 15–17, 2026",
    month: "JUL",
    day: "15",
    location: "Daytona Beach, FL",
    description: "Three days of sun, surf, and chrome. Live music, custom bike shows, and exclusive Wet Kitty merch drops.",
    rsvpCount: 247,
  },
  {
    id: 2,
    title: "Pacific Coast Cruise",
    date: "August 8–10, 2026",
    month: "AUG",
    day: "08",
    location: "Malibu to San Diego, CA",
    description: "A coastal cruise from Malibu to San Diego. Beach stops, bonfires, and the best sunset views on the west coast.",
    rsvpCount: 183,
  },
  {
    id: 3,
    title: "Sturgis Beach Party",
    date: "August 20–22, 2026",
    month: "AUG",
    day: "20",
    location: "Sturgis, SD",
    description: "Our annual Sturgis takeover. Pool party, live DJ, and a limited-edition rally tee only available at the event.",
    rsvpCount: 412,
  },
  {
    id: 4,
    title: "Galveston Surf & Turf",
    date: "September 12–14, 2026",
    month: "SEP",
    day: "12",
    location: "Galveston, TX",
    description: "Surf competition by day, bike night by evening. Wet Kitty pop-up shop with event-exclusive embroidered gear.",
    rsvpCount: 156,
  },
  {
    id: 5,
    title: "Miami Beach Bash",
    date: "October 5–7, 2026",
    month: "OCT",
    day: "05",
    location: "South Beach, Miami, FL",
    description: "Season closer. Yacht party, beach volleyball tournament, and the reveal of our winter collection.",
    rsvpCount: 328,
  },
];

function formatEventDate(event: any) {
  if (event.startDate) {
    const d = new Date(event.startDate);
    return {
      month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()).padStart(2, '0'),
      dateStr: event.endDate
        ? `${d.toLocaleDateString('en', { month: 'long', day: 'numeric' })} – ${new Date(event.endDate).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}`
        : d.toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
  }
  return { month: event.month || 'TBD', day: event.day || '??', dateStr: event.date || '' };
}

export default function Events() {
  const [rsvpEvents, setRsvpEvents] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();

  const { data: dbEvents = [], isLoading } = trpc.features.events.list.useQuery();

  const rsvpMutation = trpc.features.events.rsvp.useMutation({
    onSuccess: () => toast.success("You're in! See you there."),
    onError: () => toast.error("Sign in to RSVP"),
  });

  // Use DB events if available, otherwise show fallback
  const events = dbEvents.length > 0 ? dbEvents.map((e: any) => {
    const { month, day, dateStr } = formatEventDate(e);
    return { ...e, month, day, date: dateStr, rsvpCount: e.rsvpCount || 0 };
  }) : fallbackEvents;

  const handleRsvp = (eventId: number) => {
    if (isAuthenticated && dbEvents.length > 0) {
      rsvpMutation.mutate({ eventId });
    }
    if (rsvpEvents.includes(eventId)) {
      setRsvpEvents(rsvpEvents.filter((id) => id !== eventId));
      toast.success("RSVP removed");
    } else {
      setRsvpEvents([...rsvpEvents, eventId]);
      toast.success("You're in! See you there.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #0a0a0e 0%, #0d2030 30%, #1a3a4a 50%, #0d2030 70%, #0a0a0e 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(216, 195, 155, 0.08) 0%, transparent 50%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />

        <div className="container relative z-10 py-20 text-center">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block" style={{ color: "var(--sand)" }}>
            Events
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-editorial)", lineHeight: 1.1 }}
          >
            Beach Rally Calendar
          </h1>
          <p
            className="text-lg md:text-xl max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "rgba(255, 250, 240, 0.6)" }}
          >
            Sun, surf, chrome, and community.
          </p>
        </div>
      </section>

      <WaveSeparator />

      {/* ─── EVENTS LIST ─── */}
      <section className="section">
        <div className="container max-w-3xl">
          <div className="space-y-5">
            {events.map((event: any) => {
              const isRsvped = rsvpEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="group rounded-2xl border border-border/50 bg-card p-6 md:p-7 transition-all duration-300 hover:shadow-lg hover:border-teal/20"
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                >
                  <div className="flex gap-5 md:gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-16 h-16 md:w-18 md:h-18 rounded-xl flex flex-col items-center justify-center"
                        style={{ background: "rgba(21, 154, 153, 0.06)", border: "1px solid rgba(21, 154, 153, 0.1)" }}
                      >
                        <span className="text-[10px] font-bold tracking-wider" style={{ color: "var(--teal)" }}>
                          {event.month}
                        </span>
                        <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                          {event.day}
                        </span>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-bold text-foreground mb-2 group-hover:text-teal transition-colors"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {event.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {event.rsvpCount} interested
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.description}</p>
                      <button
                        onClick={() => handleRsvp(event.id)}
                        className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                        style={{ color: isRsvped ? "var(--teal)" : "var(--foreground)" }}
                      >
                        {isRsvped ? (
                          <>✓ I'm Going</>
                        ) : (
                          <>
                            RSVP <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <WaveSeparator />

      {/* ─── CTA ─── */}
      <section className="section">
        <div className="container text-center max-w-lg">
          <h2 className="display-sm text-foreground mb-3">Want to host a rally?</h2>
          <p className="text-sm text-muted-foreground mb-8">
            We partner with local organizers to bring the Wet Kitty experience to new cities. Get in touch.
          </p>
          <a href="/community" className="btn btn-primary inline-flex">
            Join the Crew
          </a>
        </div>
      </section>
    </div>
  );
}
