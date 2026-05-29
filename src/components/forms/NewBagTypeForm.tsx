"use client";

import React, { useState } from "react";
import { createBagTypeAction } from "@/features/bag-type/bag-type.actions";
import { useRouter } from "next/navigation";

interface NewBagTypeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewBagTypeForm({ onSuccess, onCancel }: NewBagTypeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
    };

    const result = await createBagTypeAction(data);

    if (result?.data?.success) {
      onSuccess();
      router.refresh();
    } else {
      setError("Failed to register container. Ensure name is unique.");
      setLoading(false);
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
          placeholder="e.g. 40L BACKPACK"
          required
          disabled={loading}
        />
      </div>

      <div
        className="sign-panel"
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          background: "var(--surface-alt)",
        }}
      >
        NOTE: Containers registered here will be available for all cargo
        allocation. Check dimensions before finalizing.
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
          {loading ? "Registering..." : "Authorize Unit"}
        </button>
      </div>
    </form>
  );
}
