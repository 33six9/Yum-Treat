"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChrome } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth() || {};
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-80px)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <h1 className="font-display text-3xl font-extrabold text-ink-950">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-900/60">Sign in to track orders and leave reviews.</p>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogle}
            disabled={googleLoading}
            className="btn-outline mt-8 flex w-full items-center justify-center gap-2"
          >
            <FiChrome />
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </motion.button>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink-900/40">
            <span className="h-px flex-1 bg-ink-900/10" />
            or
            <span className="h-px flex-1 bg-ink-900/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-900/50">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-900/50">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs font-semibold text-ember-700">{error}</p>}
            <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign in"}
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-ink-900/60">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-ember-600 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden bg-ink-950 lg:block">
        <Image src="/images/misc/banner-1.png" alt="" fill className="object-cover opacity-80" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>
    </section>
  );
}
