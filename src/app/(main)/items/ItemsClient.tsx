"use client";

import React, { useState } from "react";
import { ItemRow } from "@/components/items/ItemRow";
import { Modal } from "@/components/Modal/Modal";
import { NewItemForm } from "@/components/forms/NewItemForm";
import { EditItemForm } from "@/components/forms/EditItemForm";
import styles from "@/components/items/Items.module.css";
import { useRouter } from "next/navigation";

interface ItemsClientProps {
  initialItems: any[];
  categories: any[];
}

export default function ItemsClient({
  initialItems,
  categories,
}: ItemsClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const router = useRouter();

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingItem(null);
    router.refresh();
  };

  return (
    <div className="dashboard-page" style={{ padding: "4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "3rem",
          borderBottom: "4px solid var(--border)",
          paddingBottom: "1.5rem",
        }}
      >
        <h1 style={{ marginBottom: 0 }}>Item Inventory</h1>
        <button className="btn-sign" onClick={() => setIsCreateModalOpen(true)}>
          Register New Cargo
        </button>
      </div>

      <div className={styles.inventoryTable}>
        <div className={styles.tableHeader}>
          <span>ID</span>
          <span>Description</span>
          <span>Classification</span>
          <span>Weight</span>
          <span>Actions</span>
        </div>

        {initialItems.length === 0 ? (
          <div
            style={{ padding: "2rem", textAlign: "center", fontWeight: 800 }}
          >
            INVENTORY EMPTY. AUTHORIZATION REQUIRED.
          </div>
        ) : (
          initialItems.map((item) => (
            <ItemRow
              key={item.id}
              id={item.id}
              name={item.name}
              weight={item.defaultWeight || 0}
              categories={item.categories}
              onEdit={() => setEditingItem(item)}
            />
          ))
        )}
      </div>

      <section
        className="sign-panel sign-panel-accent"
        style={{ marginTop: "4rem" }}
      >
        <h2>Inventory Control</h2>
        <p style={{ fontWeight: 600 }}>
          Items registered here can be allocated to any manifest. Ensure weight
          specifications are accurate for total payload calculation.
        </p>
      </section>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="REGISTER NEW CARGO"
        gate="C-12"
      >
        <NewItemForm
          categories={categories}
          onSuccess={handleSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="EDIT CARGO ITEM"
        gate="C-12"
      >
        {editingItem && (
          <EditItemForm
            item={editingItem}
            allCategories={categories}
            onSuccess={handleSuccess}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </Modal>
    </div>
  );
}
