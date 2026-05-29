"use client";

import React, { useState } from "react";
import { createListAction } from "@/features/list/list.actions";
import { useRouter } from "next/navigation";

interface NewListFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewListForm({ onSuccess, onCancel }: NewListFormProps) {
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
      destination: formData.get("destination") as string,
      tripDate: formData.get("tripDate")
        ? new Date(formData.get("tripDate") as string)
        : undefined,
      lengthOfStay: formData.get("lengthOfStay")
        ? parseInt(formData.get("lengthOfStay") as string)
        : undefined,
      isTemplate: formData.get("isTemplate") === "on",
    };

    const result = await createListAction(data);

    if (result?.data?.success) {
      onSuccess();
      router.refresh();
      if (result.data.list) {
        router.push(`/lists/${result.data.list.id}`);
      }
    } else {
      setError("Failed to create manifest. Please check all requirements.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Manifest Name</label>
        <input
          name="name"
          type="text"
          className="form-input"
          placeholder="e.g. TOKYO WEEKEND"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Destination</label>
        <input
          name="destination"
          type="text"
          className="form-input"
          placeholder="e.g. NRT / TOKYO"
          disabled={loading}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        <div className="form-group">
          <label className="form-label">Departure Date</label>
          <input
            name="tripDate"
            type="date"
            className="form-input"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Duration (Days)</label>
          <input
            name="lengthOfStay"
            type="number"
            className="form-input"
            min="1"
            placeholder="0"
            disabled={loading}
          />
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
          {loading ? "Processing..." : "Authorize Manifest"}
        </button>
      </div>
    </form>
  );
}
