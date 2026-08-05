"use client";
import { useState } from "react";
import { Modal } from "@/components/Modal/Modal";
import { NewCategoryForm } from "@/components/forms/NewCategoryForm";
import { EditCategoryForm } from "@/components/forms/EditCategoryForm";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageContainer, PageOverlay } from "@/styles/layout.styles";
import { Category } from "@/generated/prisma/browser";
import { BottomCard } from "@/components/BottomCard";
import { z } from "zod";
import { handleActionErrors } from "@/utils/handle-action-errors";
import { createCategorySchema } from "@/features/category/category.schemas";
import { createCategoryAction } from "@/features/category/category.actions";
import { MutedText } from "@/styles/text.styles";
import { token } from "@/styled-system/tokens";
import { deleteCategoryAction } from "@/features/category/category.actions";
import { styled } from "@/styled-system/jsx";
import { Button } from "@/components/Button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";

type CategoryFormData = z.infer<typeof createCategorySchema>;

interface CategoriesClientProps {
  initialCategories: Category[];
}

const CategoryContainer = styled("div", {
  base: {
    border: "1px solid",
    marginBottom: token("spacing.2"),
    borderColor: {
      base: "gray.300",
      _dark: "gray.600",
    },
    background: {
      base: "white",
      _dark: "gray.900",
    },
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    padding: token("spacing.4"),
    borderRadius: token("radii.sm"),
    width: "100%",
  },
});

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
      color: formData.get("color") as string,
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

  async function handleDeleteCategory(category: Category) {
    setLoading(true);
    try {
      const result = await deleteCategoryAction({ id: category.id });

      // Optionally handle errors if deleteCategoryAction returns an ActionResponse
      const serverError = handleActionErrors(result, (field, error) => {
        setFieldErrors((prev) => ({ ...prev, [field]: error.message || true }));
      });

      if (serverError) {
        console.error("Delete failed:", serverError);
        return;
      }

      // Refresh server components & re-fetch initialCategories
      router.refresh();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
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
        <div style={{ marginTop: token("spacing.8") }}>
          {initialCategories.length === 0 ? (
            <MutedText>
              No Categories. Create a Category to get started.
            </MutedText>
          ) : (
            initialCategories.map((category: Category) => (
              <CategoryContainer key={category.id}>
                <div
                  style={{
                    flex: "1 1 25%",
                  }}
                >
                  <div
                    style={{
                      background: `${category.color}40`,
                      border: `1px solid ${category.color}`,
                      width: "fit-content",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      gap: token("spacing.2"),
                    }}
                  >
                    <CategoryIcon
                      value={category.icon}
                      color={
                        category.color
                          ? category.color
                          : token("colors.text.main")
                      }
                      size={18}
                    />
                    {category.name}
                  </div>
                </div>
                <div
                  style={{
                    flex: "1 1 25%",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {category.name}
                </div>
                <div
                  style={{
                    flex: "1 1 20%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    alignContent: "center",
                    gap: token("spacing.2"),
                  }}
                >
                  {/* {category.icon && (
                    <DynamicIcon
                      name={category.icon}
                      color={category.color}
                      size={24}
                    />
                  )} */}
                  <CategoryIcon
                    value={category.icon}
                    color={token("colors.text.main")}
                    // color={
                    //   category.color
                    //     ? category.color
                    //     : token("colors.text.main")
                    // }
                  />
                  <a
                    style={{
                      paddingInline: token("spacing.2"),
                      paddingBlock: token("spacing.1"),
                      fontSize: token("fontSizes.sm"),
                      // background: token("colors.label"),
                      border: "thin solid",
                      borderColor: token("colors.label"),
                      borderRadius: token("radii.md"),
                    }}
                    href={`https://lucide.dev/icons/?search=${category.icon}`}
                    target="_blank"
                  >
                    {category.icon}
                  </a>
                </div>
                <div
                  style={{
                    flex: "1 1 15%",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 8px",
                      background: category.color ?? "",
                      color: "#fff",
                      fontSize: "0.65rem",
                    }}
                  >
                    {category.color ? category.color : "None"}
                  </span>
                </div>
                <div
                  style={{
                    flex: "1 1 10%",
                    display: "flex",
                    gap: token("spacing.2"),
                  }}
                >
                  <Button
                    text="Edit"
                    variant="secondary"
                    size="small"
                    width="fit"
                    onClick={() => setEditingCategory(category)}
                    iconLeft={<Pencil size={16} />}
                  />
                  <Button
                    text="Delete"
                    variant="secondary"
                    size="small"
                    width="fit"
                    onClick={() => handleDeleteCategory(category)}
                    iconLeft={<Trash2 size={16} />}
                  />
                </div>
              </CategoryContainer>
            ))
          )}
        </div>

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create"
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
          title="Edit"
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
