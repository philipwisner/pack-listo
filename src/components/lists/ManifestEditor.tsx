"use client";

import React, { useTransition } from "react";
import styles from "./ManifestEditor.module.css";
import {
  togglePackedAction,
  removeFromListAction,
} from "@/features/list-item/list-item.actions";
import { AddItemToManifest } from "./AddItemToManifest";

interface ListItem {
  id: string;
  quantity: number;
  isPacked: boolean;
  item: {
    name: string;
    category: { name: string; color?: string | null };
  };
}

interface ManifestEditorProps {
  listId: string;
  name: string;
  items: ListItem[];
  availableItems: { id: string; name: string }[];
}

export function ManifestEditor({
  listId,
  name,
  items,
  availableItems,
}: ManifestEditorProps) {
  const [isPending, startTransition] = useTransition();

  const handleTogglePacked = (listItemId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await togglePackedAction({ listItemId, isPacked: !currentStatus });
    });
  };

  const handleRemove = (listItemId: string) => {
    startTransition(async () => {
      await removeFromListAction({ listItemId });
    });
  };

  return (
    <div className={styles.editorContainer}>
      <header className={styles.manifestHeader}>
        <div className={styles.routeCode}>
          <span>FLT</span>
          <strong>{listId.slice(0, 4).toUpperCase()}</strong>
        </div>
        <h1>{name}</h1>
      </header>

      <div className={styles.manifestTable}>
        <div className={styles.tableHead}>
          <span>Status</span>
          <span>Cargo Description</span>
          <span>Qty</span>
          <span>Category</span>
          <span>Actions</span>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            No items allocated to this manifest.
          </div>
        ) : (
          items.map((li) => (
            <div
              key={li.id}
              className={`${styles.itemRow} ${li.isPacked ? styles.packed : ""}`}
            >
              <div className={styles.statusCol}>
                <button
                  onClick={() => handleTogglePacked(li.id, li.isPacked)}
                  className={styles.paxBox}
                >
                  {li.isPacked ? "✓" : ""}
                </button>
              </div>
              <div className={styles.nameCol}>{li.item.name}</div>
              <div className={styles.qtyCol}>x{li.quantity}</div>
              <span className={styles.tag}>{li.item.category.name}</span>
              <div className={styles.actionCol}>
                <button
                  onClick={() => handleRemove(li.id)}
                  className={styles.dangerBtn}
                >
                  UNLOAD
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.actionToolbar}>
        <AddItemToManifest listId={listId} availableItems={availableItems} />
      </div>
    </div>
  );
}
