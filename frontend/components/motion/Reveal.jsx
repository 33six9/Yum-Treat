"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Fades/slides a section in the moment it scrolls into view. Wrap any
// section or block with this instead of hand-writing the same
// initial/whileInView/viewport boilerplate everywhere.
export function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

// Container that staggers its direct motion children in as it scrolls
// into view. Pair with <StaggerItem> (or the `staggerItem` variant below)
// for each child.
export function StaggerReveal({ children, className = "", stagger = 0.09, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

export { EASE };
