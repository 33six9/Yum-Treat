"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle, FiArrowLeft,
} from "react-icons/fi";
import { SectionHeading } from "@/components/UI";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";

const INFO = [
  { icon: FiMapPin, title: "Visit us",  detail: "24 Harbor Lane, Foodie District" },
  { icon: FiPhone,  title: "Call us",   detail: "+1 (555) 019-2244" },
  { icon: FiMail,   title: "Email us",  detail: "hello@yumtreat.com" },
  { icon: FiClock,  title: "Open hours",detail: "Mon–Sun, 10:00 – 23:00" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", guests: "2", date: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Table booking request — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nGuests: ${form.guests}\nPreferred date: ${form.date}\n\n${form.message}`
    );
    window.location.href = `mailto:hello@yumtreat.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      {/* HERO — dark, warm accent */}
      <section className="relative overflow-hidden bg-ink-450">
        {/* subtle ember glow, not a flat tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-ember-500/20 blur-[120px]"
        />
        <div className="container-x relative py-20 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="We'd love to hear from you"
              title="Contact & reservations"
              subtitle="Questions, feedback, or booking a table for a group — reach out and we'll get right back to you."
              tone="dark"
            />
          </Reveal>
        </div>
      </section>

      {/* CONTENT — light section, seamless transition */}
      <section className="bg-ink-150 py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          {/* INFO GRID — 2 cols on the left */}
          <StaggerReveal className="grid grid-cols-1 gap-4 self-start sm:grid-cols-2 lg:col-span-2">
            {INFO.map(({ icon: Icon, title, detail }) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group h-full rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-ember-500 transition-colors group-hover:bg-ember-600 group-hover:text-white">
                    <Icon size={18} />
                  </span>
                  <p className="mt-4 font-display font-bold text-ink-950">{title}</p>
                  <p className="mt-1 text-sm text-ink-900/55">{detail}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          {/* FORM — 3 cols on the right, bigger surface */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-sm sm:p-8">
              <header className="mb-6">
                <h3 className="font-display text-xl font-bold text-ink-950">
                  Book a table
                </h3>
                <p className="mt-1 text-sm text-ink-900/55">
                  We'll confirm within a few hours.
                </p>
              </header>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl border border-ember-600/15 bg-ember-50 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember-600 text-white"
                      >
                        <FiCheckCircle size={16} />
                      </motion.span>
                      <div>
                        <p className="font-display font-bold text-ink-950">
                          Request ready to send
                        </p>
                        <p className="mt-1 text-sm text-ink-900/60">
                          Your email app should have opened with the details. Hit send and we'll take it from there.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ember-700 hover:text-ember-600"
                    >
                      <FiArrowLeft size={14} /> Edit request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full name">
                        <input
                          required
                          placeholder="Jane Doe"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="field"
                        />
                      </Field>
                      <Field label="Email">
                        <input
                          required
                          type="email"
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="field"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Guests">
                        <input
                          type="number"
                          min="1"
                          value={form.guests}
                          onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                          className="field"
                        />
                      </Field>
                      <Field label="Preferred date">
                        <input
                          required
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                          className="field"
                        />
                      </Field>
                    </div>

                    <Field label="Anything we should know?">
                      <textarea
                        rows={4}
                        placeholder="Allergies, occasion, seating preference…"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="field resize-none"
                      />
                    </Field>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-ember-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-600/40 focus-visible:ring-offset-2"
                    >
                      Send request <FiSend />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-900/50">
        {label}
      </span>
      {children}
    </label>
  );
}