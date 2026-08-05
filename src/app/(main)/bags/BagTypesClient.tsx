"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { BagType } from "@/generated/prisma/browser";
import { createCategorySchema } from "@/features/category/category.schemas";
import { BottomCard } from "@/components/BottomCard";
import {
  ColorTag,
  InlineButtonsContainer,
  ListContainer,
  ListItemContainer,
  PageContainer,
  PageOverlay,
} from "@/styles/layout.styles";
import { PageHeader } from "@/components/PageHeader";
import { MutedText } from "@/styles/text.styles";
import { FALLBACK_ICON, Icon, IconLabelLink } from "@/components/Icon";
import { Button } from "@/components/Button/Button";
import {
  CATEGORY_COLORS,
  FALLBACK_CATEGORY_COLOR,
} from "@/features/category/category.constants";
import { token } from "@/styled-system/tokens";
import { Pencil, Trash2 } from "lucide-react";
import { handleActionErrors } from "@/utils/handle-action-errors";
import {
  createBagTypeAction,
  updateBagTypeAction,
  deleteBagTypeAction,
} from "@/features/bag-type/bag-type.actions";
import { CategoryLabel } from "@/components/CategoryLabel";

type BagTypeFormData = z.infer<typeof createCategorySchema>;

interface BagTypesClientProps {
  initialBagTypes: BagType[];
}

export default function BagTypesClient({
  initialBagTypes,
}: BagTypesClientProps) {
  const router = useRouter();
  const [isNew, setIsNew] = useState<boolean>(false);
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [currentBagType, setCurrentBagType] = useState<BagType | undefined>(
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
    setCurrentBagType(undefined);
    setFieldErrors({});
    router.refresh();
  };

  function getRandomElement(arr: string[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const selectUnusedColor = () => {
    const usedColors = initialBagTypes.map((bag) => bag.color);
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
        name: !nameInput?.validity.valid ? "Bag name is required" : false,
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
    const data: BagTypeFormData = {
      name: formData.get("name") as string,
      color: colorValue,
      icon: iconValue,
    };

    let result;
    if (isNew) {
      result = await createBagTypeAction(data);
    } else if (currentBagType) {
      result = await updateBagTypeAction({ id: currentBagType.id, ...data });
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

  async function handleDeleteBagType(bag: BagType) {
    setLoading(true);
    try {
      const result = await deleteBagTypeAction({ id: bag.id });

      const serverError = handleActionErrors(result, (field, error) => {
        setFieldErrors((prev) => ({ ...prev, [field]: error.message || true }));
      });

      if (serverError) {
        console.error("Delete failed:", serverError);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete bag:", error);
    } finally {
      setLoading(false);
    }
  }

  const bagTypeInputs = [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "e.g. Backpack",
      required: true,
      defaultValue: currentBagType?.name || "",
    },
    {
      id: "color",
      label: "Color",
      type: "text",
      placeholder: "e.g. #FFCA08",
      required: false,
      defaultValue: currentBagType?.color || "",
    },
    {
      id: "icon",
      label: "Icon",
      type: "text",
      placeholder: "e.g. backpack",
      required: false,
      defaultValue: currentBagType?.icon || "",
    },
  ];

  return (
    <>
      {showBottomCard && (
        <BottomCard
          heading={`${isNew ? "Create" : "Update"} Bag`}
          onClose={() => setShowBottomCard(false)}
          inputs={bagTypeInputs}
          button={{
            text: `${isNew ? "Create" : "Update"} Bag`,
            type: "submit",
          }}
          onSave={handleSubmit}
          isLoading={loading}
          fieldErrors={fieldErrors}
        />
      )}
      <PageContainer>
        {showBottomCard && <PageOverlay />}
        <PageHeader
          text="My Bags"
          button={{
            text: "Create Bag",
            onClick: () => {
              setCurrentBagType(undefined);
              setShowBottomCard(true);
              setIsNew(true);
            },
          }}
        />
        <ListContainer>
          {initialBagTypes.length === 0 ? (
            <MutedText>No Bags. Create a Bag to get started.</MutedText>
          ) : (
            initialBagTypes.map((bag: BagType) => (
              <ListItemContainer key={bag.id}>
                <div
                  style={{
                    flex: "1 1 25%",
                  }}
                >
                  <CategoryLabel category={bag} />
                </div>
                <div
                  style={{
                    flex: "1 1 25%",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {bag.name}
                </div>
                <div
                  style={{
                    flex: "1 1 20%",
                    display: "flex",
                  }}
                >
                  <IconLabelLink
                    href={`https://lucide.dev/icons/?search=${bag.icon}`}
                    target="_blank"
                  >
                    <Icon
                      value={bag.icon}
                      color={token("colors.text.main")}
                      size={16}
                    />
                    {bag.icon}
                  </IconLabelLink>
                </div>
                <div
                  style={{
                    flex: "1 1 15%",
                  }}
                >
                  <ColorTag
                    style={{
                      background: bag.color
                        ? bag.color
                        : FALLBACK_CATEGORY_COLOR,
                    }}
                  >
                    {bag.color ? bag.color : FALLBACK_CATEGORY_COLOR}
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
                      setCurrentBagType(bag);
                    }}
                    iconLeft={<Pencil size={16} />}
                  />
                  <Button
                    text="Delete"
                    variant="delete"
                    size="small"
                    width="fit"
                    onClick={() => handleDeleteBagType(bag)}
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
