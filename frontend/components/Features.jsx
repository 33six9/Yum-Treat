"use client";

import { motion } from "framer-motion";
import { FiTruck, FiThumbsUp, FiShield, FiHeart } from "react-icons/fi";
import { StaggerReveal, StaggerItem } from "@/components/motion/Reveal";

const FEATURES = [
  { icon: FiTruck, title: "Lightning delivery", desc: "Hot food at your door in 25 minutes or less, guaranteed." },
  { icon: FiThumbsUp, title: "Quality first", desc: "Locally sourced ingredients, prepped fresh every single morning." },
  { icon: FiShield, title: "Secure ordering", desc: "Encrypted checkout and live order tracking, start to finish." },
  { icon: FiHeart, title: "Made with care", desc: "Recipes perfected over 12 years by our in-house chefs." },
];

export default function Features() {
  return (
    <section className="section-pad">
      <StaggerReveal className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <StaggerItem key={title}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="card h-full p-7 transition-shadow hover:shadow-glow"
            >
              <motion.span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-500/10 text-ember-600"
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Icon size={22} />
              </motion.span>
              <h3 className="mt-5 font-display text-lg font-bold text-ink-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{desc}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
