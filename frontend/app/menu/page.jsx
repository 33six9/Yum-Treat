"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import CategoryStrip from "@/components/CategoryStrip";
import FoodCard from "@/components/FoodCard";
import { Loader, ErrorState, EmptyState, SectionHeading } from "@/components/UI";
import { Reveal, StaggerReveal } from "@/components/motion/Reveal";
import { getFoods, getCategories } from "@/lib/api";

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category"));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    let alive = true;
    Promise.all([getFoods(), getCategories()])
      .then(([f, c]) => {
        if (!alive) return;
        setFoods(f);
        setCategories(c);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => { alive = false; };
  }, []);

  // keep URL in sync with category (shareable links)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory) params.set("category", activeCategory);
    else params.delete("category");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeCategory]); // eslint-disable-line

  const filtered = useMemo(() => {
    let list = [...foods];
    if (activeCategory) list = list.filter((f) => f.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.currentPrice - b.currentPrice); break;
      case "price-desc": list.sort((a, b) => b.currentPrice - a.currentPrice); break;
      case "rating": list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
    return list;
  }, [foods, activeCategory, query, sort]);

  const hasFilters = Boolean(activeCategory || query.trim());
  const clearAll = () => { setActiveCategory(null); setQuery(""); };

  return (
    <>
      {/* HERO */}
      <section className="border-b border-ink-900/5 bg-ink-150">
        <div className="container-x py-14 sm:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="The full spread"
              title="Our menu"
              subtitle="Every dish, every category, all in one place. Filter, search, and add straight to your cart."
            />
          </Reveal>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-30 border-b border-ink-900/5 bg-white/85 backdrop-blur-md"
      >
        <div className="container-x py-4">
          {/* Row 1: search + sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes…"
                aria-label="Search dishes"
                className="w-full rounded-full border border-ink-900/10 bg-white py-2.5 pl-11 pr-10 text-sm outline-none transition focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10"
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-900/40 hover:bg-ink-900/5 hover:text-ink-900"
                  >
                    <FiX />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort dishes"
              className="rounded-full border border-ink-900/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10"
            >
              <option value="popular">Popular</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
          </div>

          {/* Row 2: categories */}
          {status === "ready" && (
            <div className="mt-3 -mx-1 overflow-x-auto pb-1">
              <CategoryStrip
                categories={categories}
                active={activeCategory}
                onSelect={setActiveCategory}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* RESULTS */}
      <section className="container-x py-10 sm:py-14">
        {status === "ready" && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-900/60">
              {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}
              {activeCategory && <> in <span className="font-medium text-ink-900">{activeCategory}</span></>}
              {query.trim() && <> matching “<span className="font-medium text-ink-900">{query}</span>”</>}
            </p>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-ink-900/60 underline-offset-4 hover:text-ink-900 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {status === "loading" && <Loader label="Loading the menu…" />}
        {status === "error" && (
          <ErrorState message="Couldn't load the menu — check that the backend API is running." />
        )}
        {status === "ready" && filtered.length === 0 && (
          <EmptyState
            title="No dishes match your search"
            subtitle="Try a different category or clear your search."
            action={hasFilters && <button onClick={clearAll} className="btn-primary mt-4">Clear filters</button>}
          />
        )}
        {status === "ready" && filtered.length > 0 && (
          <StaggerReveal
            key={`${activeCategory}|${query}|${sort}`}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
          >
            {filtered.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </StaggerReveal>
        )}
      </section>
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<Loader />}>
      <MenuContent />
    </Suspense>
  );
}
