"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShoppingBag, FiUser } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalCount } = useCart() || {};
  const { isAuthenticated, isAdmin, user, logout } = useAuth() || {};

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/85 backdrop-blur-md">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="container-x flex h-20 items-center justify-between"
      >
        <Link
  href="/"
  className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink-950"
>
  <img
    src="/logo.png"
    alt="YumTreat logo"
    className="h-20 w-20 object-contain"
  />

  
</Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-ember-600 ${
                pathname === link.href ? "text-ember-600" : "text-ink-900/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-semibold transition-colors hover:text-ember-600 ${
                pathname.startsWith("/admin") ? "text-ember-600" : "text-ink-900/80"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink-900 transition hover:border-ember-500 hover:text-ember-600"
            aria-label="Cart"
          >
            <FiShoppingBag size={18} />
            <AnimatePresence>
              {totalCount > 0 && (
                <motion.span
                  key={totalCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ember-500 text-[10px] font-bold text-white"
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/account"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink-900 transition hover:border-ember-500 hover:text-ember-600"
                aria-label="Account"
                title={user?.email}
              >
                <FiUser size={18} />
              </Link>
              <button onClick={logout} className="btn-outline !py-2.5 !px-4 text-xs">
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/signin" className="hidden btn-primary !py-2.5 !px-5 text-xs sm:inline-flex">
              Sign in
            </Link>
          )}

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </motion.div>

      {open && (
        <div className="border-t border-black/5 bg-cream md:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-ink-900 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-ink-900 hover:bg-white"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-ink-900 hover:bg-white"
                >
                  My account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-ember-700 hover:bg-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-ember-700 hover:bg-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
