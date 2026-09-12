"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.span
        className="font-display text-8xl font-extrabold text-ember-500"
        initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        <motion.span
          className="inline-block"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          4
        </motion.span>
        <motion.span
          className="inline-block"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          0
        </motion.span>
        <motion.span
          className="inline-block"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          4
        </motion.span>
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-display text-2xl font-bold text-ink-950"
      >
        This plate isn&apos;t on the menu
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-sm text-sm text-ink-900/60"
      >
        The page you&apos;re looking for doesn&apos;t exist, or it may have been moved.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
      </motion.div>
    </section>
  );
}
