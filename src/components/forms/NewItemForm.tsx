"use client";

import React, { useState } from "react";
import { createItemAction } from "@/features/item/item.actions";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface NewItemFormProps {
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewItemForm({
  categories,
  onSuccess,
  onCancel,
}: NewItemFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const selected = formData.get("categoryId") as string | null;

    const data = {
      name: formData.get("name") as string,
      defaultWeight: formData.get("weight")
        ? parseFloat(formData.get("weight") as string)
        : undefined,
      categoryId: selected ? String(selected) : undefined,
    };

    const result = await createItemAction(data);

    if (result?.data?.success) {
      onSuccess();
      router.refresh();
    } else {
      setError(
        "Failed to register cargo. Ensure all specifications are valid.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Cargo Description</label>
        <input
          name="name"
          type="text"
          className="form-input"
          placeholder="e.g. ULTRA-LIGHT RAIN SHELL"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Weight (KG)</label>
        <input
          name="weight"
          type="number"
          step="0.01"
          className="form-input"
          placeholder="0.00"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Classification</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            maxHeight: "150px",
            overflowY: "auto",
            border: "2px solid var(--border)",
            padding: "1rem",
          }}
        >
          {categories.map((cat) => (
            <label
              key={cat.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="categoryId"
                value={cat.id}
                disabled={loading}
                style={{ width: "18px", height: "18px" }}
              />
              {cat.name}
            </label>
          ))}
          {categories.length === 0 && (
            <span style={{ opacity: 0.5 }}>NO CLASSIFICATIONS DEFINED</span>
          )}
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
          {loading ? "Registering..." : "Authorize Cargo"}
        </button>
      </div>
    </form>
  );
}
