"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";

export function StatsBar() {
  const stats = [
    { value: "12+", label: "Years of flavor" },
    { value: "60k+", label: "Orders delivered" },
    { value: "4.8", label: "Average rating" },
    { value: "35", label: "Signature dishes" },
  ];
  return (
    <section className="border-y border-black/5 bg-white">
      <StaggerReveal className="container-x grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label} className="text-center">
            <p className="font-display text-3xl font-extrabold text-ember-600 sm:text-4xl">
              <CountUp value={s.value} />
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-900/50">{s.label}</p>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-ink-950 px-8 py-16 sm:px-16">
          <motion.div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ember-600/30 blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Hungry already? Your table (or your couch) is waiting.
              </h2>
              <p className="mt-4 max-w-lg text-white/60">
                Order online for pickup or delivery, or reserve a table and let our kitchen do the rest.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/menu" className="btn-primary">
                    Browse the menu <FiArrowRight />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact" className="btn-ghost-light">
                    Reserve a table
                  </Link>
                </motion.div>
              </div>
            </div>
            <motion.div
              className="relative mx-auto hidden aspect-square w-56 lg:block"
              animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/images/foods/pizza-2.png" alt="Pepperoni pizza" fill className="object-contain drop-shadow-2xl" />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
