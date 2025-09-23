"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ProfileFormProps {
  initialData?: {
    name?: string;
    email?: string;
    sustainabilityGoals?: string;
   
  } | null;
  onSave: (updated: any) => void;
  onCancel: () => void;
}

export default function ProfileForm({
  initialData,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    sustainabilityGoals: initialData?.sustainabilityGoals || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "carbonSaved" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const updated = await res.json();
      onSave(updated);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">
          {initialData ? "Edit Profile" : "Set Up Your Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Sustainability Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sustainability Goals
            </label>
            <textarea
              name="sustainabilityGoals"
              value={form.sustainabilityGoals}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Reduce carbon footprint by 30%"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          {/* Carbon Saved */}
         

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
