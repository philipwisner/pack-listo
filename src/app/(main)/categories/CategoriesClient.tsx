"use client";
import { useState } from "react";
import { Modal } from "@/components/Modal/Modal";
import { NewCategoryForm } from "@/components/forms/NewCategoryForm";
import { EditCategoryForm } from "@/components/forms/EditCategoryForm";
import styles from "@/components/items/Items.module.css";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageContainer, PageOverlay } from "@/styles/layout.styles";
import { Category } from "@/generated/prisma/browser";
import { BottomCard } from "@/components/BottomCard";
import { z } from "zod";
import { handleActionErrors } from "@/utils/handle-action-errors";
import { createCategorySchema } from "@/features/category/category.schemas";
import { createCategoryAction } from "@/features/category/category.actions";

type CategoryFormData = z.infer<typeof createCategorySchema>;

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({
  initialCategories,
}: CategoriesClientProps) {
  const router = useRouter();
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | boolean>
  >({});
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setShowBottomCard(false);
    setEditingCategory(null);
    setFieldErrors({});
    router.refresh();
  };

  const createCategoryInputs = [
    {
      id: "name",
      label: "Category Name",
      type: "text",
      placeholder: "Your category name",
      required: true,
    },
    {
      id: "color",
      label: "Color",
      type: "text",
      placeholder: "Color",
      required: false,
    },
    {
      id: "icon",
      label: "Icon",
      type: "text",
      placeholder: "Icon",
      required: false,
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const form = e.currentTarget;
    const nameInput = form.querySelector("#name") as HTMLInputElement;

    // 1. Client-Side HTML5 Pre-validation
    if (!form.checkValidity()) {
      setFieldErrors({
        name: !nameInput?.validity.valid ? "Category name is required" : false,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData(form);
    const data: CategoryFormData = {
      name: formData.get("name") as string,
      color: "red",
      icon: "box",
    };

    // 2. Execute Server Action
    const result = await createCategoryAction(data);

    // 3. Process action errors (if any) via helper
    const serverError = handleActionErrors(result, (field, error) => {
      setFieldErrors((prev) => ({ ...prev, [field]: error.message || true }));
    });

    if (serverError) {
      setFieldErrors((prev) => ({ ...prev, server: serverError }));
      setLoading(false);
      return;
    }

    // 4. Handle Success
    const responseData = result?.data as { success?: boolean } | undefined;
    if (responseData?.success) {
      handleSuccess();
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      {showBottomCard && (
        <BottomCard
          heading="Create Category"
          onClose={() => setShowBottomCard(false)}
          inputs={createCategoryInputs}
          button={{ text: "Create Category", type: "submit" }}
          onSave={handleSubmit}
          isLoading={loading}
          fieldErrors={fieldErrors}
        />
      )}
      <PageContainer>
        {showBottomCard && <PageOverlay />}
        <PageHeader
          text="My Categories"
          button={{
            text: "Create Category",
            onClick: () => {
              setShowBottomCard(true);
              setIsCreateModalOpen(true);
            },
          }}
        />

        <div className={styles.inventoryTable}>
          <div className={styles.tableHeader}>
            <span>Code</span>
            <span>Label</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {initialCategories.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", fontWeight: 800 }}
            >
              NO CLASSIFICATIONS DEFINED.
            </div>
          ) : (
            initialCategories.map((cat: any) => (
              <div
                key={cat.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 1fr 100px",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid var(--border-muted)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                <div style={{ opacity: 0.6, fontSize: "0.75rem" }}>
                  #{cat.id.slice(0, 4).toUpperCase()}
                </div>
                <div>{cat.name}</div>
                <div>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: cat.color || "var(--border)",
                      color: "#fff",
                      fontSize: "0.65rem",
                    }}
                  >
                    ACTIVE
                  </span>
                </div>
                <div>
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditingCategory(cat)}
                  >
                    EDIT
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

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
      </PageContainer>
    </>
  );
}
