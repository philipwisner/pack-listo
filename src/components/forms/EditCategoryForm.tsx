"use client";

import React, { useState } from "react";
import {
  updateCategoryAction,
  deleteCategoryAction,
} from "@/features/category/category.actions";
import { useRouter } from "next/navigation";

interface EditCategoryFormProps {
  category: {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
  };
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

export function EditCategoryForm({
  category,
  onSuccess,
  onCancel,
}: EditCategoryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    category.color || COLORS[0].value,
  );
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: category.id,
      name: formData.get("name") as string,
      color: selectedColor,
      icon: "box",
    };

    const result = await updateCategoryAction(data);

    if (result?.data?.success) {
      router.refresh();
      onSuccess();
    } else {
      setError("Failed to update classification.");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Delete this classification? Items using it will be unclassified.",
      )
    )
      return;
    setDeleting(true);
    const result = await deleteCategoryAction({ id: category.id });
    if (result?.data?.success) {
      router.refresh();
      onSuccess();
    } else {
      setError("Failed to delete classification.");
      setDeleting(false);
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
          defaultValue={category.name}
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
              {selectedColor === color.value && "✓"}
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

      <div className="form-actions" style={{ justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading || deleting}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1.5rem",
            fontWeight: 800,
            textTransform: "uppercase",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          {deleting ? "Removing..." : "Delete"}
        </button>
        <div style={{ display: "flex", gap: "1rem" }}>
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
            Cancel
          </button>
          <button type="submit" className="btn-sign" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
