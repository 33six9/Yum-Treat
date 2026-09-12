"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Stars, EmptyState } from "@/components/UI";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";
import { useAuth } from "@/context/AuthContext";
import { addReview } from "@/lib/api";

export default function ReviewsPanel({ food, reviews, onReviewAdded }) {
  const { isAuthenticated } = useAuth() || {};
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const created = await addReview({ productID: food._id, rating, feedback });
      onReviewAdded(created);
      setFeedback("");
      setRating(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-pad bg-ink-950/[0.02]">
      <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink-950">Customer reviews</h2>
          {reviews.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No reviews yet" subtitle="Be the first to share how this dish tasted." />
            </div>
          ) : (
            <StaggerReveal className="mt-6 space-y-5">
              <AnimatePresence initial={false}>
                {reviews.map((r) => (
                  <StaggerItem key={r._id}>
                    <motion.div layout className="card p-6">
                      <div className="flex items-center justify-between">
                        <Stars rating={r.rating} />
                        <span className="text-xs text-ink-900/40">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink-900/70">{r.feedback}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </AnimatePresence>
            </StaggerReveal>
          )}
        </div>

        <Reveal delay={0.1} className="card h-fit p-7">
          <h3 className="font-display text-lg font-bold text-ink-950">Leave a review</h3>
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-900/50">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.button
                      type="button"
                      key={n}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(n)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        n <= rating ? "bg-saffron text-ink-950" : "bg-ink-900/5 text-ink-900/40"
                      }`}
                    >
                      {n}
                    </motion.button>
                  ))}
                </div>
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How was it?"
                rows={4}
                className="input-field"
                required
              />
              {error && <p className="text-xs font-semibold text-ember-700">{error}</p>}
              <motion.button
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? "Submitting…" : "Submit review"}
              </motion.button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-ink-900/60">
              <Link href="/signin" className="font-semibold text-ember-600 hover:underline">
                Sign in
              </Link>{" "}
              to leave a review for this dish.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
