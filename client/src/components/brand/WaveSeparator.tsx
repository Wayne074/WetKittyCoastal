/**
 * Animated wave separator — the signature Wet Kitty section divider.
 * A gentle, continuous wave animation that evokes the ocean.
 */
export default function WaveSeparator({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""} ${className}`} style={{ height: "60px" }}>
      <svg
        className="absolute bottom-0 w-[200%] animate-wave"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ height: "100%" }}
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 C1680,60 1920,0 2160,30 C2400,60 2640,0 2880,30 L2880,60 L0,60 Z"
          fill="var(--background)"
          opacity="0.5"
        />
        <path
          d="M0,40 C240,10 480,50 720,40 C960,10 1200,50 1440,40 C1680,10 1920,50 2160,40 C2400,10 2640,50 2880,40 L2880,60 L0,60 Z"
          fill="var(--background)"
          opacity="0.8"
        />
        <path
          d="M0,50 C240,35 480,55 720,50 C960,35 1200,55 1440,50 C1680,35 1920,55 2160,50 C2400,35 2640,55 2880,50 L2880,60 L0,60 Z"
          fill="var(--background)"
        />
      </svg>
      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave {
          animation: wave 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
