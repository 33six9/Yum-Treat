"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiMinus, FiPlus, FiShoppingBag, FiChevronLeft, FiCheck } from "react-icons/fi";
import { Loader, ErrorState, Stars } from "@/components/UI";
import FoodCard from "@/components/FoodCard";
import { StaggerReveal } from "@/components/motion/Reveal";
import { getFoodById, getFoods, getReviewsByProduct, foodImage } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import ReviewsPanel from "@/components/ReviewsPanel";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart() || {};

  const [food, setFood] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("loading");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    getFoodById(id)
      .then(async (data) => {
        if (!alive) return;
        setFood(data);
        setStatus("ready");
        getFoods()
          .then((all) => alive && setRelated(all.filter((f) => f.category === data.category && f._id !== data._id).slice(0, 4)))
          .catch(() => {});
        getReviewsByProduct(id)
          .then((r) => alive && setReviews(r))
          .catch(() => alive && setReviews([]));
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [id]);

  if (status === "loading") return <Loader label="Loading dish…" />;
  if (status === "error" || !food)
    return <ErrorState message="We couldn't find that dish." onRetry={() => router.push("/menu")} />;

  const hasDiscount = food.pastPrice && food.pastPrice > food.currentPrice;

  return (
    <>
      <section className="container-x py-8">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900/60 hover:text-ember-600"
        >
          <FiChevronLeft /> Back
        </motion.button>
      </section>

      <section className="container-x grid gap-12 pb-16 lg:grid-cols-2 lg:items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-ember-50 to-ember-100/60"
        >
          {(food.isPopular || food.isSpecial || hasDiscount) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 18 }}
              className="absolute left-6 top-6 z-10 badge"
            >
              {hasDiscount ? "Sale" : food.isSpecial ? "Chef's pick" : "Popular"}
            </motion.span>
          )}
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <Image src={foodImage(food.imageUrl)} alt={food.name} fill className="object-contain p-12" priority />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-ember-600">{food.category}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink-950 sm:text-4xl">{food.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <Stars rating={food.rating} />
            <span className="text-sm text-ink-900/50">
              {(food.rating || 0).toFixed(1)} ({food.numberOfReviews || 0} reviews)
            </span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-ink-900/65">{food.description}</p>

          {food.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {food.tags.map((t) => (
                <span key={t} className="rounded-full bg-ink-900/5 px-3 py-1 text-xs font-semibold capitalize text-ink-900/60">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-ember-600">${food.currentPrice?.toFixed(2)}</span>
            {hasDiscount && <span className="text-lg text-ink-900/40 line-through">${food.pastPrice.toFixed(2)}</span>}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 rounded-full border border-ink-900/10 px-4 py-2.5">
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-ink-900/60 hover:text-ember-600">
                <FiMinus />
              </motion.button>
              <span className="relative w-6 overflow-hidden text-center font-bold">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={qty}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="block"
                  >
                    {qty}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQty((q) => q + 1)} className="text-ink-900/60 hover:text-ember-600">
                <FiPlus />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: added ? 1 : 1.03 }}
              whileTap={{ scale: added ? 1 : 0.97 }}
              animate={added ? { backgroundColor: "#16a34a" } : { backgroundColor: "#fb6a17" }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                addItem?.(food, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
              className="btn-primary flex-1 sm:flex-none"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2"
                  >
                    <FiCheck /> Added!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2"
                  >
                    <FiShoppingBag /> Add to cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {!food.isAvailable && (
            <p className="mt-4 text-sm font-semibold text-ember-700">Currently unavailable — check back soon.</p>
          )}
        </motion.div>
      </section>

      <ReviewsPanel food={food} reviews={reviews} onReviewAdded={(r) => setReviews((prev) => [r, ...prev])} />

      {related.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-x">
            <h2 className="font-display text-2xl font-extrabold text-ink-950">You might also like</h2>
            <StaggerReveal className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {related.map((f) => (
                <FoodCard key={f._id} food={f} />
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}
    </>
  );
}
