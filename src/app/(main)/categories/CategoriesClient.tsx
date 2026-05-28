'use client';

import React, { useState } from 'react';
import { Modal } from "@/components/ui/Modal";
import { NewCategoryForm } from "@/components/forms/NewCategoryForm";
import { EditCategoryForm } from "@/components/forms/EditCategoryForm";
import styles from "@/components/items/Items.module.css";
import { useRouter } from "next/navigation";

interface CategoriesClientProps {
  initialCategories: any[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const router = useRouter();

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingCategory(null);
    router.refresh();
  };

  return (
    <div className="dashboard-page" style={{ padding: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '4px solid var(--border)', paddingBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: 0 }}>Classifications</h1>
        <button
          className="btn-sign"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Define New Category
        </button>
      </div>

      <div className={styles.inventoryTable}>
        <div className={styles.tableHeader}>
          <span>Code</span>
          <span>Label</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {initialCategories.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 800 }}>NO CLASSIFICATIONS DEFINED.</div>
        ) : (
          initialCategories.map((cat: any) => (
            <div key={cat.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 100px', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>#{cat.id.slice(0, 4).toUpperCase()}</div>
              <div>{cat.name}</div>
              <div>
                <span style={{ padding: '2px 8px', background: cat.color || 'var(--border)', color: '#fff', fontSize: '0.65rem' }}>ACTIVE</span>
              </div>
              <div>
                <button className={styles.editBtn} onClick={() => setEditingCategory(cat)}>EDIT</button>
              </div>
            </div>
          ))
        )}
      </div>

      <section className="sign-panel" style={{ marginTop: '4rem' }}>
        <h2>Standard Protocols</h2>
        <p style={{ fontWeight: 600 }}>Categories define regional groupings for cargo manifest sorting. All items must have at least one primary classification.</p>
      </section>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="DEFINE NEW CLASSIFICATION"
        gate="D-04"
      >
        <NewCategoryForm
          onSuccess={handleSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="EDIT CLASSIFICATION"
        gate="D-04"
      >
        {editingCategory && (
          <EditCategoryForm
            category={editingCategory}
            onSuccess={handleSuccess}
            onCancel={() => setEditingCategory(null)}
          />
        )}
      </Modal>
    </div>
  );
}
