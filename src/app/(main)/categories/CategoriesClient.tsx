"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Category } from "@/generated/prisma/browser";
import { token } from "@/styled-system/tokens";
import { Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BottomCard } from "@/components/BottomCard";
import { FALLBACK_ICON, Icon, IconLabelLink } from "@/components/Icon";
import { Button } from "@/components/Button/Button";
import { createCategorySchema } from "@/features/category/category.schemas";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/features/category/category.actions";
import { deleteCategoryAction } from "@/features/category/category.actions";
import { handleActionErrors } from "@/utils/handle-action-errors";
import { MutedText } from "@/styles/text.styles";
import {
  ColorTag,
  InlineButtonsContainer,
  ListContainer,
  ListItemContainer,
  PageContainer,
  PageOverlay,
} from "@/styles/layout.styles";
import { CategoryLabel } from "@/components/CategoryLabel";
import {
  CATEGORY_COLORS,
  FALLBACK_CATEGORY_COLOR,
} from "@/features/category/category.constants";
import { Drawer } from "@/components/Drawer/Drawer";
import { DrawerContent } from "@/components/Drawer/DrawerContent";

type CategoryFormData = z.infer<typeof createCategorySchema>;

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({
  initialCategories,
}: CategoriesClientProps) {
  const router = useRouter();
  const [isNew, setIsNew] = useState<boolean>(true);
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | boolean>
  >({});

  const handleSuccess = () => {
    setShowBottomCard(false);
    setIsNew(true);
    setLoading(false);
    setCurrentCategory(undefined);
    setFieldErrors({});
    router.refresh();
  };

  function getRandomElement(arr: string[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const selectUnusedColor = () => {
    const usedColors = initialCategories.map((category) => category.color);
    const availableColors = CATEGORY_COLORS.filter((color) => {
      return !usedColors.includes(color);
    });
    if (availableColors.length !== 0) {
      return getRandomElement(availableColors);
    } else {
      return FALLBACK_CATEGORY_COLOR;
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const form = e.currentTarget;
    const nameInput = form.querySelector("#name") as HTMLInputElement;

    if (!form.checkValidity()) {
      setFieldErrors({
        name: !nameInput?.validity.valid ? "Category name is required" : false,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData(form);
    let colorValue = formData.get("color") as string;
    const isColorEmpty = !colorValue || colorValue.trim() === "";
    if (isColorEmpty) {
      colorValue = selectUnusedColor();
    }
    let iconValue = formData.get("icon") as string;
    const isIconEmpty = !iconValue || iconValue.trim() === "";
    if (isIconEmpty) {
      iconValue = FALLBACK_ICON;
    }
    const data: CategoryFormData = {
      name: formData.get("name") as string,
      color: colorValue,
      icon: iconValue,
    };

    let result;
    if (isNew) {
      result = await createCategoryAction(data);
    } else if (currentCategory) {
      result = await updateCategoryAction({ id: currentCategory.id, ...data });
    }

    // // 3. Process action errors (if any) via helper
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

      const serverError = handleActionErrors(result, (field, error) => {
        setFieldErrors((prev) => ({ ...prev, [field]: error.message || true }));
      });

      if (serverError) {
        console.error("Delete failed:", serverError);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setLoading(false);
    }
  }

  const categoryInputs = [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "e.g. Clothing",
      required: true,
      defaultValue: currentCategory?.name || "",
    },
    {
      id: "color",
      label: "Color",
      type: "text",
      placeholder: "e.g. #FFCA08",
      required: false,
      defaultValue: currentCategory?.color || "",
    },
    {
      id: "icon",
      label: "Icon",
      type: "text",
      placeholder: "e.g. shirt",
      required: false,
      defaultValue: currentCategory?.icon || "",
    },
  ];

  return (
    <>
      {showBottomCard && (
        <BottomCard
          heading={`${isNew ? "Create" : "Update"} Category`}
          onClose={() => setShowBottomCard(false)}
          inputs={categoryInputs}
          button={{
            text: `${isNew ? "Create" : "Update"} Category`,
            type: "submit",
          }}
          onSave={handleSubmit}
          isLoading={loading}
          fieldErrors={fieldErrors}
        />
      )}
      <Drawer
        triggerLabel="Open"
        snapPoints={[0.25, 0.5, 1]}
        defaultSnapPoint={0.25}
        showClose={true}
      >
        <DrawerContent
          heading={`${isNew ? "Create" : "Update"} Category`}
          onClose={() => setShowBottomCard(false)}
          inputs={categoryInputs}
          button={{
            text: `${isNew ? "Create" : "Update"} Category`,
            type: "submit",
          }}
          onSave={handleSubmit}
          isLoading={loading}
          fieldErrors={fieldErrors}
        />
      </Drawer>
      <PageContainer>
        {showBottomCard && <PageOverlay />}
        <PageHeader
          text="My Categories"
          button={{
            text: "Create Category",
            onClick: () => {
              setCurrentCategory(undefined);
              setShowBottomCard(true);
              setIsNew(true);
            },
          }}
        />

        <ListContainer>
          {initialCategories.length === 0 ? (
            <MutedText>
              No Categories. Create a Category to get started.
            </MutedText>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingInline: token("spacing.4"),
                  paddingBlock: token("spacing.2"),
                  width: "100%",
                  fontWeight: token("fontWeights.bold"),
                  justifyContent: "flex-start",
                  alignContent: "center",
                  padding: token("spacing.4"),
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: "2.5 1 150px",
                  }}
                >
                  Category
                </div>
                <div
                  style={{
                    flex: "2.5 1 150px",
                  }}
                >
                  Name
                </div>
                <div
                  style={{
                    flex: "2 1 130px",
                  }}
                >
                  Icon
                </div>
                <div
                  style={{
                    flex: "2 1 100px",
                  }}
                >
                  Color
                </div>
                <div
                  style={{
                    flex: "1 1 200px",
                  }}
                />
              </div>
              {initialCategories.map((category: Category) => (
                <ListItemContainer key={category.id}>
                  <div
                    style={{
                      flex: "2.5 1 150px",
                    }}
                  >
                    <CategoryLabel category={category} />
                  </div>
                  <div
                    style={{
                      flex: "2.5 1 150px",
                      fontSize: token("fontSizes.lg"),
                      fontWeight: token("fontWeights.bold"),
                    }}
                  >
                    {category.name}
                  </div>
                  <div
                    style={{
                      flex: "2 1 130px",
                      display: "flex",
                    }}
                  >
                    <IconLabelLink
                      href={`https://lucide.dev/icons/?search=${category.icon}`}
                      target="_blank"
                    >
                      <Icon
                        value={category.icon}
                        color={token("colors.text.main")}
                        size={16}
                      />
                      {category.icon}
                    </IconLabelLink>
                  </div>
                  <div
                    style={{
                      flex: "2 1 100px",
                    }}
                  >
                    <ColorTag
                      style={{
                        background: category.color
                          ? category.color
                          : FALLBACK_CATEGORY_COLOR,
                      }}
                    >
                      {category.color
                        ? category.color
                        : FALLBACK_CATEGORY_COLOR}
                    </ColorTag>
                  </div>
                  <InlineButtonsContainer>
                    <Button
                      text="Edit"
                      variant="secondary"
                      size="small"
                      width="fit"
                      onClick={() => {
                        setShowBottomCard(true);
                        setIsNew(false);
                        setCurrentCategory(category);
                      }}
                      iconLeft={<Pencil size={16} />}
                    />
                    <Button
                      text="Delete"
                      variant="delete"
                      size="small"
                      width="fit"
                      onClick={() => handleDeleteCategory(category)}
                      iconLeft={<Trash2 size={16} />}
                    />
                  </InlineButtonsContainer>
                </ListItemContainer>
              ))}
            </>
          )}
        </ListContainer>
      </PageContainer>
    </>
  );
}
