"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import AdminGuard from "@/components/AdminGuard";
import { Loader, EmptyState, SectionHeading } from "@/components/UI";
import { getFoods, getCategories, addFood, updateFood, deleteFood, foodImage } from "@/lib/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  imageUrl: "",
  category: "",
  currentPrice: "",
  pastPrice: "",
  isPopular: false,
  isSpecial: false,
  isSuperDeals: false,
  isAvailable: true,
};

export default function AdminFoodsPage() {
  return (
    <AdminGuard>
      <FoodsManager />
    </AdminGuard>
  );
}

function FoodsManager() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [editing, setEditing] = useState(null); // food object or "new" or null
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setStatus("loading");
    Promise.all([getFoods(), getCategories()])
      .then(([f, c]) => {
        setFoods(f);
        setCategories(c);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, category: categories[0]?.name || "" });
    setEditing("new");
  };

  const openEdit = (food) => {
    setForm({
      name: food.name,
      description: food.description,
      imageUrl: food.imageUrl,
      category: food.category,
      currentPrice: food.currentPrice,
      pastPrice: food.pastPrice || "",
      isPopular: !!food.isPopular,
      isSpecial: !!food.isSpecial,
      isSuperDeals: !!food.isSuperDeals,
      isAvailable: food.isAvailable !== false,
    });
    setEditing(food);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    await deleteFood(id);
    setFoods((prev) => prev.filter((f) => f._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      currentPrice: Number(form.currentPrice),
      pastPrice: form.pastPrice ? Number(form.pastPrice) : undefined,
    };
    try {
      if (editing === "new") {
        const created = await addFood(payload);
        setFoods((prev) => [created, ...prev]);
      } else {
        const updated = await updateFood(editing._id, payload);
        setFoods((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
      }
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Admin" title="Menu items" subtitle="Add new dishes or update existing ones — changes go live immediately." />
          <button onClick={openNew} className="btn-primary shrink-0">
            <FiPlus /> Add dish
          </button>
        </div>

        <div className="mt-10">
          {status === "loading" && <Loader label="Loading menu items…" />}
          {status === "error" && <p className="text-sm text-ember-700">Couldn&apos;t load menu items.</p>}
          {status === "ready" && foods.length === 0 && (
            <EmptyState title="No dishes yet" subtitle="Add your first menu item to get started." />
          )}
          {status === "ready" && foods.length > 0 && (
            <div className="overflow-x-auto rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-ink-900/10 text-xs font-bold uppercase tracking-wide text-ink-900/45">
                  <tr>
                    <th className="px-6 py-4">Dish</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food._id} className="border-b border-ink-900/5 last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 rounded-xl bg-ember-50">
                            <Image src={foodImage(food.imageUrl)} alt={food.name} fill className="object-contain p-1" />
                          </div>
                          <span className="font-semibold text-ink-950">{food.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-900/60">{food.category}</td>
                      <td className="px-6 py-4 font-semibold text-ember-600">${food.currentPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${food.isAvailable !== false ? "bg-emerald-500/10 text-emerald-700" : "bg-ink-900/5 text-ink-900/40"}`}>
                          {food.isAvailable !== false ? "Available" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(food)} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/5 text-ink-900/60 hover:bg-ember-500 hover:text-white">
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(food._id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/5 text-ink-900/60 hover:bg-red-500 hover:text-white">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-ink-950">
                {editing === "new" ? "Add dish" : `Edit ${editing.name}`}
              </h3>
              <button onClick={() => setEditing(null)} className="text-ink-900/40 hover:text-ink-950">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input required placeholder="Dish name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
              <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field" />
              <div className="grid gap-4 sm:grid-cols-2">
                <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-field">
                  <option value="" disabled>Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <input
                  required
                  placeholder="Image key (e.g. burger-1)"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required type="number" step="0.01" placeholder="Current price" value={form.currentPrice} onChange={(e) => setForm((f) => ({ ...f, currentPrice: e.target.value }))} className="input-field" />
                <input type="number" step="0.01" placeholder="Past price (optional)" value={form.pastPrice} onChange={(e) => setForm((f) => ({ ...f, pastPrice: e.target.value }))} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["isPopular", "Popular"],
                  ["isSpecial", "Special"],
                  ["isSuperDeals", "Deal"],
                  ["isAvailable", "Available"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-xl bg-ink-900/5 px-3 py-2 text-xs font-semibold text-ink-900/70">
                    <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
              {error && <p className="text-xs font-semibold text-ember-700">{error}</p>}
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? "Saving…" : editing === "new" ? "Add dish" : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
