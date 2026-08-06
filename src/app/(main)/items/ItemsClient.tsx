"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Item, Category } from "@/generated/prisma/browser";
import { getCategoriesAction } from "@/features/category/category.actions";
import {
  InlineButtonsContainer,
  ListContainer,
  ListItemContainer,
  PageContainer,
} from "@/styles/layout.styles";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { MutedText } from "@/styles/text.styles";
import { handleActionErrors } from "@/utils/handle-action-errors";
import {
  createItemAction,
  deleteItemAction,
  updateItemAction,
} from "@/features/item/item.actions";
import { createItemSchema } from "@/features/item/item.schemas";
import z from "zod";
import { CategoryLabel } from "@/components/CategoryLabel";
import { token } from "@/styled-system/tokens";
import { Drawer } from "@/components/Drawer/Drawer";
import { DrawerContent } from "@/components/Drawer/DrawerContent";

type ItemWithCategory = Item & { category: Category | null };

interface ItemsClientProps {
  initialItems: ItemWithCategory[];
}

type ItemFormData = z.infer<typeof createItemSchema>;

export default function ItemsClient({ initialItems }: ItemsClientProps) {
  const router = useRouter();
  const [isNew, setIsNew] = useState<boolean>(false);
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemWithCategory | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | boolean>
  >({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategoriesAction();
      if (result?.data) {
        setCategories(result.data as Category[]);
      }
    }
    loadCategories();
  }, []);

  const handleSuccess = () => {
    setShowBottomCard(false);
    setIsNew(true);
    setLoading(false);
    setCurrentItem(undefined);
    setFieldErrors({});
    router.refresh();
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const form = e.currentTarget;
    const nameInput = form.querySelector("#name") as HTMLInputElement;

    if (!form.checkValidity()) {
      setFieldErrors({
        name: !nameInput?.validity.valid ? "Item name is required" : false,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData(form);
    const categoryIdVal = formData.get("categoryId") as string;
    const data: ItemFormData = {
      name: formData.get("name") as string,
      categoryId: categoryIdVal || null,
    };

    let result;
    if (isNew) {
      result = await createItemAction(data);
    } else if (currentItem) {
      result = await updateItemAction({ id: currentItem.id, ...data });
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

  async function handleDeleteItem(item: ItemWithCategory) {
    setLoading(true);
    try {
      const result = await deleteItemAction({ id: item.id });

      const serverError = handleActionErrors(result, (field, error) => {
        setFieldErrors((prev) => ({ ...prev, [field]: error.message || true }));
      });

      if (serverError) {
        console.error("Delete failed:", serverError);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setLoading(false);
    }
  }

  const itemInputs = [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "e.g. Phone",
      required: true,
      defaultValue: currentItem?.name || "",
    },
    // {
    //   id: "categoryId",
    //   label: "Category",
    //   type: "select",
    //   placeholder: "e.g. Electronics",
    //   required: false,
    //   option: categories,
    //   defaultValue: currentItem?.categoryId || "",
    // },
    {
      id: "categoryId",
      label: "Category",
      type: "custom-select",
      placeholder: "e.g. Electronics",
      required: false,
      option: categories,
      defaultValue: currentItem?.categoryId || "",
    },
  ];

  return (
    <>
      <Drawer
        snapPoints={[0.25, 0.5]}
        defaultSnapPoint={0.25}
        isOpen={showBottomCard}
        closeDrawer={() => setShowBottomCard(false)}
      >
        <DrawerContent
          heading={`${isNew ? "Create" : "Update"} Item`}
          onClose={() => setShowBottomCard(false)}
          inputs={itemInputs}
          button={{
            text: `${isNew ? "Create" : "Update"} Item`,
            type: "submit",
          }}
          onSave={handleSubmit}
          isLoading={loading}
          fieldErrors={fieldErrors}
        />
      </Drawer>
      <PageContainer>
        <PageHeader
          text="My Items"
          button={{
            text: "Create Item",
            onClick: () => {
              setCurrentItem(undefined);
              setShowBottomCard(true);
              setIsNew(true);
            },
          }}
        />
        <ListContainer>
          {initialItems.length === 0 ? (
            <MutedText>No Items. Create an Item to get started.</MutedText>
          ) : (
            initialItems.map((item: ItemWithCategory) => (
              <ListItemContainer key={item.id}>
                <div
                  style={{
                    flex: "2 1 150px",
                    fontSize: token("fontSizes.lg"),
                    fontWeight: token("fontWeights.bold"),
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    flex: "2.5 1 100px",
                  }}
                >
                  {item?.category ? (
                    <CategoryLabel category={item.category} />
                  ) : (
                    "Unassigned"
                  )}
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
                      setCurrentItem(item);
                    }}
                    iconLeft={<Pencil size={16} />}
                  />
                  <Button
                    text="Delete"
                    variant="delete"
                    size="small"
                    width="fit"
                    onClick={() => handleDeleteItem(item)}
                    iconLeft={<Trash2 size={16} />}
                  />
                </InlineButtonsContainer>
              </ListItemContainer>
            ))
          )}
        </ListContainer>
      </PageContainer>
    </>
  );
}
