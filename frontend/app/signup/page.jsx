"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChrome } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth() || {};
  const [form, setForm] = useState({ name: "", email: "", password: "", cPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.cPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
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
      <div className="relative hidden bg-ink-950 lg:block">
        <Image src="/images/misc/book-table.jpg" alt="" fill className="object-cover opacity-80" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <h1 className="font-display text-3xl font-extrabold text-ink-950">Create your account</h1>
          <p className="mt-2 text-sm text-ink-900/60">Save addresses, track orders, and leave reviews.</p>

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
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-900/50">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="Your name"
              />
            </div>
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
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input-field"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-900/50">Confirm password</label>
              <input
                type="password"
                required
                value={form.cPassword}
                onChange={(e) => setForm((f) => ({ ...f, cPassword: e.target.value }))}
                className="input-field"
                placeholder="Re-enter password"
              />
            </div>
            {error && <p className="text-xs font-semibold text-ember-700">{error}</p>}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Creating account…" : "Create account"}
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-ink-900/60">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-ember-600 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
