"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiPlus, FiCheck } from "react-icons/fi";
import { foodImage } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { staggerItem } from "@/components/motion/Reveal";

export default function FoodCard({ food }) {
  const { addItem } = useCart() || {};
  const [justAdded, setJustAdded] = useState(false);
  const hasDiscount = food.pastPrice && food.pastPrice > food.currentPrice;

  const handleAdd = () => {
    addItem?.(food, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <motion.div
      variants={staggerItem}
      layout
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5"
    >
      <Link href={`/menu/${food._id}`} className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-ember-50 to-ember-100/70 p-6">
        {(food.isPopular || food.isSpecial || hasDiscount) && (
          <motion.span
            className="absolute left-4 top-4 z-10 badge"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
          >
            {hasDiscount ? "Sale" : food.isSpecial ? "Chef's pick" : "Popular"}
          </motion.span>
        )}
        <motion.div className="relative h-full w-full" whileHover={{ scale: 1.08, rotate: -1 }} transition={{ type: "spring", stiffness: 250, damping: 18 }}>
          <Image
            src={foodImage(food.imageUrl)}
            alt={food.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-6"
          />
        </motion.div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-xs font-semibold text-saffron">
          <FiStar className="fill-saffron" />
          <span className="text-ink-900/70">
            {(food.rating || 0).toFixed(1)} · {food.numberOfReviews || 0} reviews
          </span>
        </div>

        <Link href={`/menu/${food._id}`}>
          <h3 className="mt-2 font-display text-lg font-bold text-ink-950 hover:text-ember-600">
            {food.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-ink-900/60">{food.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-extrabold text-ember-600">
              ${food.currentPrice?.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-ink-900/40 line-through">${food.pastPrice.toFixed(2)}</span>
            )}
          </div>
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            animate={justAdded ? { backgroundColor: "#16a34a" } : { backgroundColor: "#0b0a08" }}
            transition={{ duration: 0.25 }}
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-white"
            aria-label={`Add ${food.name} to cart`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <FiCheck />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <FiPlus />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
