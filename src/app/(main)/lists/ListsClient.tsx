"use client";

import React, { useState } from "react";
import { ListCard } from "@/components/lists/ListCard";
import { Modal } from "@/components/ui/Modal";
import { NewListForm } from "@/components/forms/NewListForm";
import styles from "@/components/lists/Lists.module.css";
import { useRouter } from "next/navigation";

interface ListsClientProps {
  initialLists: any[];
}

export default function ListsClient({ initialLists }: ListsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsModalOpen(false);
    // Refresh the server component data
    router.refresh();
  };

  return (
    <div className="dashboard-page" style={{ padding: "4rem" }}>
      <div className={styles.pageHeader}>
        <h1>Manifests / Lists</h1>
        <button className="btn-sign" onClick={() => setIsModalOpen(true)}>
          Create New Manifest
        </button>
      </div>

      <div className={styles.listsGrid}>
        {initialLists.length === 0 ? (
          <div
            style={{
              padding: "4rem",
              textAlign: "center",
              border: "2px dashed var(--border)",
              fontWeight: 800,
            }}
          >
            NO MANIFESTS DETECTED. AUTHORIZATION REQUIRED.
          </div>
        ) : (
          initialLists.map((list) => (
            <ListCard
              key={list.id}
              id={list.id}
              name={list.name}
              destination={list.destination || "UNKNOWN"}
              date={
                list.tripDate
                  ? new Date(list.tripDate).toISOString().split("T")[0]
                  : "TBD"
              }
              itemCount={list._count?.items || 0}
              status={list.isTemplate ? "TEMPLATE" : "ACTIVE"}
            />
          ))
        )}
      </div>

      <section className="sign-panel" style={{ marginTop: "4rem" }}>
        <h2>Standard Procedures</h2>
        <p style={{ fontWeight: 600 }}>
          All lists must be finalized 24 hours prior to departure. Use templates
          for recurring route profiles.
        </p>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="AUTHORIZE NEW MANIFEST"
        gate="L-40"
      >
        <NewListForm
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
