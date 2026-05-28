'use client';

import React, { useState } from 'react';
import { Modal } from "@/components/ui/Modal";
import { NewBagTypeForm } from "@/components/forms/NewBagTypeForm";
import { EditBagTypeForm } from "@/components/forms/EditBagTypeForm";
import styles from "@/components/items/Items.module.css";
import { useRouter } from "next/navigation";

interface BagType {
  id: string;
  name: string;
}

interface BagTypesClientProps {
  initialBagTypes: BagType[];
}

export default function BagTypesClient({ initialBagTypes }: BagTypesClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBagType, setEditingBagType] = useState<BagType | null>(null);
  const router = useRouter();

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingBagType(null);
    router.refresh();
  };

  return (
    <div className="dashboard-page" style={{ padding: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '4px solid var(--border)', paddingBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: 0 }}>Container Types</h1>
        <button 
          className="btn-sign" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          Register New Container
        </button>
      </div>

      <div className={styles.inventoryTable}>
        <div className={styles.tableHeader}>
          <span>Type ID</span>
          <span>Description</span>
          <span>Allocation</span>
          <span>Actions</span>
        </div>
        
        {initialBagTypes.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 800 }}>NO CONTAINERS REGISTERED.</div>
        ) : (
          initialBagTypes.map((bag: any) => (
            <div key={bag.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 100px', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>#{bag.id.slice(0, 4).toUpperCase()}</div>
              <div>{bag.name}</div>
              <div style={{ fontSize: '0.75rem' }}>STANDARD CARGO</div>
              <div>
                <button className={styles.editBtn} onClick={() => setEditingBagType(bag)}>EDIT</button>
              </div>
            </div>
          ))
        )}
      </div>

      <section className="sign-panel sign-panel-accent" style={{ marginTop: '4rem' }}>
        <h2>Logistics Advisory</h2>
        <p style={{ fontWeight: 600 }}>Container types ensure accurate volume calculation for cargo manifests. Maintain exact specifications for all registered units.</p>
      </section>

      {/* Create Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="REGISTER NEW CONTAINER"
        gate="G-88"
      >
        <NewBagTypeForm 
          onSuccess={handleSuccess} 
          onCancel={() => setIsCreateModalOpen(false)} 
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingBagType}
        onClose={() => setEditingBagType(null)}
        title="EDIT CONTAINER TYPE"
        gate="G-88"
      >
        {editingBagType && (
          <EditBagTypeForm
            bagType={editingBagType}
            onSuccess={handleSuccess}
            onCancel={() => setEditingBagType(null)}
          />
        )}
      </Modal>
    </div>
  );
}
