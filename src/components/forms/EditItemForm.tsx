"use client";

import React, { useState } from "react";
import {
  updateItemAction,
  deleteItemAction,
} from "@/features/item/item.actions";
import { useRouter } from "next/navigation";

interface EditItemFormProps {
  item: {
    id: string;
    name: string;
    defaultWeight?: number | null;
    categories: { id: string; name: string; color?: string | null }[];
  };
  allCategories: { id: string; name: string; color?: string | null }[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditItemForm({
  item,
  allCategories,
  onSuccess,
  onCancel,
}: EditItemFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const existingCategoryIds = new Set(item.categories.map((c) => c.id));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const categoryIds = formData.getAll("categoryIds") as string[];

    const data = {
      id: item.id,
      name: formData.get("name") as string,
      defaultWeight: formData.get("weight")
        ? parseFloat(formData.get("weight") as string)
        : undefined,
      categoryIds,
    };

    const result = await updateItemAction(data);

    if (result?.data?.success) {
      router.refresh();
      onSuccess();
    } else {
      setError("Failed to update cargo. Ensure all specifications are valid.");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this cargo item from inventory?")) return;
    setDeleting(true);
    const result = await deleteItemAction({ id: item.id });
    if (result?.data?.success) {
      router.refresh();
      onSuccess();
    } else {
      setError("Failed to delete item.");
      setDeleting(false);
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
          defaultValue={item.name}
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
          defaultValue={item.defaultWeight ?? ""}
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
          {allCategories.map((cat) => (
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
                type="checkbox"
                name="categoryIds"
                value={cat.id}
                defaultChecked={existingCategoryIds.has(cat.id)}
                disabled={loading}
                style={{ width: "18px", height: "18px" }}
              />
              {cat.name}
            </label>
          ))}
          {allCategories.length === 0 && (
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
