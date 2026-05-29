"use client";

import React, { useState } from "react";
import {
  updateBagTypeAction,
  deleteBagTypeAction,
} from "@/features/bag-type/bag-type.actions";
import { useRouter } from "next/navigation";

interface EditBagTypeFormProps {
  bagType: {
    id: string;
    name: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditBagTypeForm({
  bagType,
  onSuccess,
  onCancel,
}: EditBagTypeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: bagType.id,
      name: formData.get("name") as string,
    };

    const result = await updateBagTypeAction(data);

    if (result?.data?.success) {
      router.refresh();
      onSuccess();
    } else {
      setError("Failed to update container specification.");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this container type?")) return;
    setDeleting(true);
    const result = await deleteBagTypeAction({ id: bagType.id });
    if (result?.data?.success) {
      router.refresh();
      onSuccess();
    } else {
      setError("Failed to delete container type.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Container Specification</label>
        <input
          name="name"
          type="text"
          className="form-input"
          defaultValue={bagType.name}
          required
          disabled={loading}
        />
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
