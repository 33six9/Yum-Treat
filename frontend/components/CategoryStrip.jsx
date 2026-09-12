"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { categoryImage } from "@/lib/api";

export default function CategoryStrip({ categories, active, onSelect }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <CategoryPill
        label="All"
        image={null}
        active={!active}
        onClick={() => onSelect(null)}
      />
      {categories.map((cat) => (
        <CategoryPill
          key={cat._id}
          label={cat.name}
          image={categoryImage(cat.img)}
          active={active === cat.name}
          onClick={() => onSelect(cat.name)}
        />
      ))}
    </div>
  );
}

function CategoryPill({ label, image, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 transition-colors ${
        active
          ? "border-ember-500 bg-ember-500 text-white shadow-glow"
          : "border-black/10 bg-white text-ink-900 hover:border-ember-400"
      }`}
    >
      {image && (
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? "bg-white/20" : "bg-ember-50"}`}>
          <Image src={image} alt="" width={22} height={22} className="object-contain" />
        </span>
      )}
      <span className="text-sm font-bold">{label}</span>
    </motion.button>
  );
}
