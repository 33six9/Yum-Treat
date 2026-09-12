"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Hero from "@/components/Hero";
import FoodCard from "@/components/FoodCard";
import { CtaBanner } from "@/components/CtaBanner";
import Testimonials from "@/components/Testimonials";
import { SectionHeading } from "@/components/UI";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";
import { getFoods, categoryImage, getCategories } from "@/lib/api";

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    Promise.all([getFoods(), getCategories()])
      .then(([foodData, catData]) => {
        if (!alive) return;
        setFoods(foodData);
        setCategories(catData);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, []);

  const popular = foods.filter((f) => f.isPopular).slice(0, 8);

  return (
    <>
      <Hero />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section-pad">
          <div className="container-x">
            <Reveal>
              <SectionHeading
                eyebrow="What are you craving?"
                title="Browse by category"
                subtitle="From wood-fired pizza to slow-simmered curry — every category is stacked with fan favorites."
              />
            </Reveal>
            <StaggerReveal className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {categories.map((cat) => (
                <StaggerItem key={cat._id}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={`/menu?category=${encodeURIComponent(cat.name)}`}
                      className="group flex flex-col items-center gap-3 rounded-3xl bg-white p-5 text-center shadow-soft ring-1 ring-black/5 transition hover:shadow-glow"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ember-50 transition group-hover:bg-ember-100">
                        <Image
                          src={categoryImage(cat.img)}
                          alt={cat.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </span>
                      <span className="text-sm font-bold text-ink-950">{cat.name}</span>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* Popular dishes */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Fan favorites"
              title="Our most-loved dishes"
              subtitle="Ranked by real orders, not guesswork. These are the plates people keep coming back for."
            />
            <Link href="/menu" className="btn-outline shrink-0">
              View full menu <FiArrowRight />
            </Link>
          </Reveal>

          {status === "loading" && (
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-ink-900/5" />
              ))}
            </div>
          )}

          {status === "error" && (
            <p className="mt-10 text-sm text-ember-700">
              Couldn&apos;t reach the menu API. Make sure the backend server is running .
            </p>
          )}

          {status === "ready" && (
            <StaggerReveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {(popular.length ? popular : foods.slice(0, 8)).map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </StaggerReveal>
          )}
        </div>
      </section>

      <CtaBanner />
      <Testimonials />
    </>
  );
}