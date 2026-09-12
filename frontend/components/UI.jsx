import { FiStar } from "react-icons/fi";
import { motion } from "framer-motion";

export function Eyebrow({ children }) {
  return <span className="badge">{children}</span>;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ink-900/60">{subtitle}</p>}
    </div>
  );
}

export function Stars({ rating = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar
          key={n}
          size={size}
          className={n <= Math.round(rating) ? "fill-saffron text-saffron" : "text-ink-900/15"}
        />
      ))}
    </div>
  );
}

export function Loader({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-ink-900/50">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-3 w-3 rounded-full bg-ember-500"
            animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-sm font-semibold text-ember-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline text-xs">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-ink-900/15 py-20 text-center">
      <h3 className="font-display text-xl font-bold text-ink-950">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-ink-900/60">{subtitle}</p>}
      {action}
    </div>
  );
}
