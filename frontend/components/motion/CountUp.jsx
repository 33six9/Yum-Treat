"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// Parses "60k+", "4.8", "12+" into a numeric target + display formatter,
// then animates a spring from 0 to that target once it scrolls into view.
export default function CountUp({ value, className = "" }) {
  const match = String(value).match(/^([\d.]+)(k?)(\+?)$/i);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  if (!match) {
    // Not a "number-ish" value (shouldn't happen with our stats, but keep
    // this safe as a plain fallback rather than throwing on unexpected input).
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const [, numStr, kSuffix, plusSuffix] = match;
  const target = parseFloat(numStr) * (kSuffix ? 1000 : 1);
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20, mass: 0.8 });
  const displayRef = useRef(null);

  useEffect(() => {
    if (inView) motionValue.set(target);
  }, [inView, target, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (!displayRef.current) return;
      const shown = kSuffix ? (v / 1000).toFixed(decimals) + "k" : v.toFixed(decimals);
      displayRef.current.textContent = shown + plusSuffix;
    });
    return unsubscribe;
  }, [spring, kSuffix, decimals, plusSuffix]);

  return (
    <motion.span ref={ref} className={className}>
      <span ref={displayRef}>0</span>
    </motion.span>
  );
}
