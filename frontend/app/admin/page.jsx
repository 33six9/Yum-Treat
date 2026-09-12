"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiGrid, FiPackage, FiDollarSign, FiUsers, FiArrowRight } from "react-icons/fi";
import AdminGuard from "@/components/AdminGuard";
import { SectionHeading, Loader } from "@/components/UI";
import { getFoods, getOrderStats } from "@/lib/api";

export default function AdminHome() {
  return (
    <AdminGuard>
      <AdminOverview />
    </AdminGuard>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([getFoods(), getOrderStats()]).then(([foods, orderStats]) => {
      setStats({
        foods: foods.length,
        orders: orderStats.totalOrders,
        revenue: orderStats.totalRevenue,
        pending: orderStats.statusCounts.preparing,
      });
    });
  }, []);

  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading eyebrow="Admin dashboard" title="Welcome back" subtitle="Manage the menu and keep on top of incoming orders." />

        {!stats ? (
          <Loader label="Loading dashboard…" />
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FiGrid} label="Menu items" value={stats.foods} />
            <StatCard icon={FiPackage} label="Total orders" value={stats.orders} />
            <StatCard icon={FiUsers} label="Orders in progress" value={stats.pending} />
            <StatCard icon={FiDollarSign} label="Revenue tracked" value={`$${stats.revenue.toFixed(2)}`} />
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Link href="/admin/foods" className="card group flex items-center justify-between p-7 transition hover:shadow-glow">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-950">Manage menu items</h3>
              <p className="mt-1 text-sm text-ink-900/55">Add, edit, or remove dishes from the live menu.</p>
            </div>
            <FiArrowRight className="text-ember-600 transition group-hover:translate-x-1" />
          </Link>
          <Link href="/admin/orders" className="card group flex items-center justify-between p-7 transition hover:shadow-glow">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-950">Manage orders</h3>
              <p className="mt-1 text-sm text-ink-900/55">Update order status as it moves through the kitchen.</p>
            </div>
            <FiArrowRight className="text-ember-600 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember-500/10 text-ember-600">
        <Icon size={18} />
      </span>
      <p className="mt-4 font-display text-2xl font-extrabold text-ink-950">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-900/45">{label}</p>
    </div>
  );
}
