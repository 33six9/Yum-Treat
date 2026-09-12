"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiPackage, FiXCircle, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders, cancelOrder, completeOrder } from "@/lib/api";
import { Loader, ErrorState, EmptyState, SectionHeading } from "@/components/UI";
import { Reveal } from "@/components/motion/Reveal";

const STATUS_STYLES = {
  preparing: "bg-saffron/20 text-ink-900",
  ready: "bg-ember-500/15 text-ember-700",
  out_for_delivery: "bg-sky-500/15 text-sky-700",
  delivered: "bg-emerald-500/15 text-emerald-700",
  cancel: "bg-red-500/10 text-red-700",
};

const STATUS_LABELS = {
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancel: "Cancelled",
};

export default function AccountPage() {
  const { isAuthenticated, ready, user, logout } = useAuth() || {};
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [busyId, setBusyId] = useState(null);

  const loadOrders = () => {
    setStatus("loading");
    getMyOrders()
      .then((data) => {
        setOrders(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    if (ready && isAuthenticated) loadOrders();
  }, [ready, isAuthenticated]);

  if (!ready) return null;

  if (!isAuthenticated) {
    return (
      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <EmptyState
              title="Sign in to view your account"
              subtitle="Track your orders, manage reviews, and see your order history."
              action={
                <Link href="/signin" className="btn-primary mt-2">
                  Sign in
                </Link>
              }
            />
          </Reveal>
        </div>
      </section>
    );
  }

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      const updated = await cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch {
      // surfaced inline via order list re-fetch failing silently is fine for now
    } finally {
      setBusyId(null);
    }
  };

  const handleComplete = async (id) => {
    setBusyId(id);
    try {
      const updated = await completeOrder(id);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="section-pad">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-center justify-between gap-6">
          <SectionHeading eyebrow="Your account" title="Order history" />
          <button onClick={logout} className="btn-outline">
            Sign out
          </button>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex items-center gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ember-500/10 text-ember-600">
            <FiUser size={22} />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-ink-950">{user?.email}</p>
            <p className="text-sm capitalize text-ink-900/50">{user?.role} account</p>
          </div>
        </Reveal>

        <div className="mt-10">
          {status === "loading" && <Loader label="Loading your orders…" />}
          {status === "error" && <ErrorState message="Couldn't load your orders." onRetry={loadOrders} />}
          {status === "ready" && orders.length === 0 && (
            <Reveal>
              <EmptyState
                title="No orders yet"
                subtitle="Once you place an order it'll show up here with live status."
                action={
                  <Link href="/menu" className="btn-primary mt-2">
                    Browse the menu
                  </Link>
                }
              />
            </Reveal>
          )}
          {status === "ready" && orders.length > 0 && (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {orders.map((order, i) => (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/5 text-ink-900/60">
                          <FiPackage />
                        </span>
                        <div>
                          <p className="font-display font-bold text-ink-950">
                            Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-xs text-ink-900/45">
                            {new Date(order.createdAt).toLocaleString()} · {order.products?.length} item
                            {order.products?.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <motion.span
                        key={order.status}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[order.status] || "bg-ink-900/5"}`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </motion.span>
                    </div>

                    {order.products?.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-ink-900/50">
                        {order.products.map((p) => (
                          <li key={p.product_id}>
                            {p.quantity}× {p.name}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-ink-900/10 pt-4">
                      <p className="text-sm text-ink-900/60">
                        Deliver to {order.address}, {order.city} · Paid ${order.payed?.toFixed ? order.payed.toFixed(2) : order.payed}
                      </p>
                      <div className="flex gap-2">
                        {order.status === "preparing" && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            disabled={busyId === order._id}
                            onClick={() => handleCancel(order._id)}
                            className="btn-outline !py-2 !px-4 text-xs"
                          >
                            <FiXCircle /> Cancel
                          </motion.button>
                        )}
                        {order.status === "delivered" && !order.isComplete && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            disabled={busyId === order._id}
                            onClick={() => handleComplete(order._id)}
                            className="btn-primary !py-2 !px-4 text-xs"
                          >
                            <FiCheckCircle /> Confirm received
                          </motion.button>
                        )}
                        {order.isComplete && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 16 }}
                            className="text-xs font-semibold text-emerald-600"
                          >
                            Completed ✓
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
