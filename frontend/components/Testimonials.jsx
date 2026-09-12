"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Stars } from "@/components/UI";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";

const REVIEWS = [
  {
    name: "Amara Reyes",
    quote:
      "Ordering was effortless and the double smash burger showed up piping hot in under 20 minutes. New weekly habit unlocked.",
    avatar: "/images/misc/our-team-1.jpg",
  },
  {
    name: "Devon Clarke",
    quote:
      "Booked a table for eight through the site in seconds. The staff already had our order preferences ready when we arrived.",
    avatar: "/images/misc/our-team-2.jpg",
  },
  {
    name: "Priya Nandan",
    quote:
      "The seafood platter is unreal — and being able to track my order status live took all the guesswork out of delivery night.",
    avatar: "/images/misc/our-team-3.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="section-pad bg-ink-950">
      <div className="container-x">
        <Reveal className="max-w-xl">
          <span className="badge !bg-white/10 !text-ember-300">Loved by regulars</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Don&apos;t just take our word for it
          </h2>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <StaggerItem key={r.name}>
              <motion.div
                whileHover={{ y: -6, borderColor: "rgba(251,106,23,0.4)" }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7"
              >
                <Stars rating={5} />
                <p className="mt-4 text-sm leading-relaxed text-white/70">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={r.avatar}
                    alt={r.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="text-sm font-bold text-white">{r.name}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
