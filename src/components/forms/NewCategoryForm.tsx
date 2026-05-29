"use client";

import React, { useState } from "react";
import { createCategoryAction } from "@/features/category/category.actions";
import { useRouter } from "next/navigation";

interface NewCategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const COLORS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#0ea5e9" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Purple", value: "#a855f7" },
];

export function NewCategoryForm({ onSuccess, onCancel }: NewCategoryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      color: selectedColor,
      icon: "box", // Default icon for now
    };

    const result = await createCategoryAction(data);

    if (result?.data?.success) {
      onSuccess();
      router.refresh();
    } else {
      setError(
        "Failed to define classification. Code already in use or invalid name.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Classification Label</label>
        <input
          name="name"
          type="text"
          className="form-input"
          placeholder="e.g. ELECTRONICS"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Regional Color Coding</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
          }}
        >
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              style={{
                height: "40px",
                background: color.value,
                border:
                  selectedColor === color.value
                    ? "4px solid var(--border)"
                    : "2px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 900,
                fontSize: "0.6rem",
              }}
              disabled={loading}
            >
              {selectedColor === color.value && "SELECT"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "var(--accent-blue)",
            color: "white",
            padding: "1rem",
            marginBottom: "2rem",
            fontWeight: 800,
          }}
        >
          ERROR: {error}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn-sign"
          style={{
            background: "transparent",
            border: "2px solid var(--border)",
            color: "var(--foreground)",
          }}
          onClick={onCancel}
          disabled={loading}
        >
          Abort
        </button>
        <button type="submit" className="btn-sign" disabled={loading}>
          {loading ? "Defining..." : "Authorize Class"}
        </button>
      </div>
    </form>
  );
}
