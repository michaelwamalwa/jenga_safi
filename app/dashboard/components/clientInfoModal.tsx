
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface ClientInfoModalProps {
  onSave: (data: any) => void;
}

export default function ClientInfoModal({ onSave }: ClientInfoModalProps) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sustainabilityGoals, setSustainabilityGoals] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: session?.user?.id || session?.user?.email,
        name,
        email,
        sustainabilityGoals,
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      const saved = await res.json();
      onSave(saved);

      await fetch("/api/carbon-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: "default-site",
        
        }),
      });
    } catch (err) {
      console.error("❌ Error saving profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">
          Set Up Your Sustainability Profile
        </h2>

        {/* Name */}
        <label className="block mb-2 font-medium">Name</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <label className="block mb-2 font-medium">Email</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Goals */}
        <label className="block mb-2 font-medium">Sustainability Goals</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-4"
          rows={3}
          value={sustainabilityGoals}
          onChange={(e) => setSustainabilityGoals(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
