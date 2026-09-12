"use client";

import { useEffect, useState } from "react";
import { FiPackage, FiSearch } from "react-icons/fi";
import AdminGuard from "@/components/AdminGuard";
import { Loader, EmptyState, SectionHeading } from "@/components/UI";
import { getAllOrders, getOrderStats, updateOrderStatus } from "@/lib/api";

const STATUSES = ["preparing", "ready", "out_for_delivery", "delivered", "cancel"];

const STATUS_LABELS = {
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancel: "Cancelled",
};

const STATUS_STYLES = {
  preparing: "bg-saffron/20 text-ink-900",
  ready: "bg-ember-500/15 text-ember-700",
  out_for_delivery: "bg-sky-500/15 text-sky-700",
  delivered: "bg-emerald-500/15 text-emerald-700",
  cancel: "bg-red-500/10 text-red-700",
};

const SORTS = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "highest_total", label: "Highest total" },
  { id: "lowest_total", label: "Lowest total" },
];

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <OrdersManager />
    </AdminGuard>
  );
}

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);

  // Debounce the search box so we're not firing a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch, sort]);

  const load = () => {
    setStatus("loading");
    getAllOrders({
      status: filter,
      search: debouncedSearch || undefined,
      sort,
      page,
      limit: 10,
    })
      .then((data) => {
        setOrders(data.orders);
        setPagination(data.pagination);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, [filter, debouncedSearch, sort, page]);

  useEffect(() => {
    getOrderStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, [status === "ready"]);

  const handleStatusChange = async (id, newStatus) => {
    setBusyId(id);
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      getOrderStats().then(setStats).catch(() => {});
    } catch {
      // no-op; list stays as-is if the update fails
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading eyebrow="Admin" title="Orders" subtitle="Move orders through the kitchen — customers see status updates instantly." />

        {stats && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Orders today" value={stats.ordersToday} />
            <StatCard label="Preparing" value={stats.statusCounts.preparing} />
            <StatCard label="Out for delivery" value={stats.statusCounts.out_for_delivery} />
            <StatCard label="Revenue (non-cancelled)" value={`$${stats.totalRevenue.toFixed(2)}`} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-900/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, order #…"
              className="input-field !py-2.5 !pl-9 !w-64 text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field !w-auto !py-2.5 text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
                filter === s ? "bg-ink-950 text-white" : "bg-ink-900/5 text-ink-900/60 hover:bg-ink-900/10"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {status === "loading" && <Loader label="Loading orders…" />}
          {status === "error" && <p className="text-sm text-ember-700">Couldn&apos;t load orders.</p>}
          {status === "ready" && orders.length === 0 && (
            <EmptyState title="No orders here" subtitle="Nothing matches this filter yet." />
          )}
          {status === "ready" && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/5 text-ink-900/60">
                        <FiPackage />
                      </span>
                      <div>
                        <p className="font-display font-bold text-ink-950">
                          Order #{order.orderNumber || order._id.slice(-6).toUpperCase()} · {order.fullName}
                        </p>
                        <p className="text-xs text-ink-900/45">
                          {new Date(order.createdAt).toLocaleString()} · {order.products?.length} item
                          {order.products?.length === 1 ? "" : "s"} · ${order.payed?.toFixed ? order.payed.toFixed(2) : order.payed}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[order.status] || "bg-ink-900/5"}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  {order.products?.length > 0 && (
                    <ul className="mt-3 space-y-1 pl-[52px] text-xs text-ink-900/50">
                      {order.products.map((p) => (
                        <li key={p.product_id}>
                          {p.quantity}× {p.name} — ${(p.price * p.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  )}

                  {order.status === "cancel" && order.cancelReason && (
                    <p className="mt-3 pl-[52px] text-xs font-semibold text-red-700">Reason: {order.cancelReason}</p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-ink-900/10 pt-4">
                    <p className="text-sm text-ink-900/60">
                      Deliver to {order.address}, {order.city} {order.postalCode} · {order.phone}
                    </p>
                    {["delivered", "cancel"].includes(order.status) ? (
                      <span className="text-xs font-semibold text-ink-900/40">Locked — no further status changes</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            disabled={busyId === order._id || order.status === s}
                            onClick={() => handleStatusChange(order._id, s)}
                            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize transition disabled:cursor-not-allowed ${
                              order.status === s
                                ? "bg-ink-950 text-white"
                                : "bg-ink-900/5 text-ink-900/60 hover:bg-ember-500 hover:text-white"
                            }`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "ready" && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-outline !py-2 !px-4 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-ink-900/50">
                Page {pagination.page} of {pagination.pages} · {pagination.total} orders
              </span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                className="btn-outline !py-2 !px-4 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-900/40">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-ink-950">{value}</p>
    </div>
  );
}
