/**
 * Paw-print loading animation — the Wet Kitty signature loader.
 * Three paw prints that animate in sequence like a cat walking.
 */
export default function PawLoader({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeMap = { sm: 16, md: 24, lg: 36 };
  const s = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-teal dark:text-sea"
          style={{
            opacity: 0,
            animation: `pawStep 1.5s ease-in-out ${i * 0.3}s infinite`,
          }}
        >
          {/* Main pad */}
          <ellipse cx="12" cy="15" rx="4.5" ry="5" />
          {/* Toe pads */}
          <circle cx="7.5" cy="9" r="2.2" />
          <circle cx="12" cy="7" r="2.2" />
          <circle cx="16.5" cy="9" r="2.2" />
        </svg>
      ))}
      <style>{`
        @keyframes pawStep {
          0%, 100% { opacity: 0.15; transform: scale(0.85) translateY(2px); }
          30%, 70% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
