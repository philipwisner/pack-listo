"use client";

import React, { useState, useTransition } from "react";
import styles from "./AddItem.module.css";
import { addToListAction } from "@/features/list-item/list-item.actions";

interface Item {
  id: string;
  name: string;
}

interface AddItemToManifestProps {
  listId: string;
  availableItems: Item[];
}

export function AddItemToManifest({
  listId,
  availableItems,
}: AddItemToManifestProps) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    if (!selectedItemId) return;

    startTransition(async () => {
      await addToListAction({ listId, itemId: selectedItemId });
      setSelectedItemId("");
      setIsOpen(false);
    });
  };

  if (!isOpen) {
    return (
      <button className="btn-sign" onClick={() => setIsOpen(true)}>
        Add Content to Manifest
      </button>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Cargo Allocation</h3>
          <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
            ×
          </button>
        </div>
        <div className={styles.body}>
          <label className={styles.label}>Select Item from Inventory</label>
          <select
            className={styles.select}
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
          >
            <option value="">-- Choose Cargo --</option>
            {availableItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            className="btn-sign"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={!selectedItemId || isPending}
            onClick={handleAdd}
          >
            {isPending ? "Allocating..." : "Allocate to Manifest"}
          </button>
        </div>
      </div>
    </div>
  );
}
