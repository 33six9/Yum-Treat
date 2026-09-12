"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiAward, FiUsers, FiHeart } from "react-icons/fi";
import { SectionHeading } from "@/components/UI";
import { StatsBar, CtaBanner } from "@/components/CtaBanner";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";

const TEAM = [
  { name: "Marcus Bell", role: "Executive Chef", photo: "/images/misc/our-team-1.jpg" },
  { name: "Sofia Han", role: "Head of Kitchen", photo: "/images/misc/our-team-2.jpg" },
  { name: "Diego Alvarez", role: "Pastry Chef", photo: "/images/misc/our-team-3.jpg" },
  { name: "Naomi Price", role: "Operations Lead", photo: "/images/misc/our-team-4.jpg" },
];

const VALUES = [
  { icon: FiAward, title: "Award-winning kitchen", desc: "Recognized three years running for best casual dining experience in the district." },
  { icon: FiUsers, title: "A team that cares", desc: "Every dish is checked by hand before it leaves the pass — no exceptions." },
  { icon: FiHeart, title: "Community first", desc: "We source from local farms and give back through our weekly community plates program." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 py-20">
        <motion.div
          className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-ember-600/20 blur-[120px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="badge !bg-white/10 !text-ember-300">Our story</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">
              Cooking with intention since day one.
            </h1>
            <p className="mt-6 max-w-lg text-white/60">
              YumTreat started as a single kitchen with one rule: never cut corners. Twelve years later that rule
              still runs everything we plate — from the produce we source to the way an order reaches your door.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[2rem]"
          >
            <Image src="/images/misc/about-img.png" alt="Chef preparing a dish" fill className="object-cover" />
          </motion.div>
        </div>
      </section>

      <StatsBar />

      <section className="section-pad">
        <StaggerReveal className="container-x grid gap-10 lg:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="card h-full p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-500/10 text-ember-600">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-ink-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal align="center">
            <SectionHeading eyebrow="Meet the team" title="The people behind every plate" align="center" />
          </Reveal>
          <StaggerReveal className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((member) => (
              <StaggerItem key={member.name} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-3xl"
                >
                  <Image src={member.photo} alt={member.name} fill className="object-cover" />
                </motion.div>
                <p className="mt-4 font-display font-bold text-ink-950">{member.name}</p>
                <p className="text-sm text-ink-900/50">{member.role}</p>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
