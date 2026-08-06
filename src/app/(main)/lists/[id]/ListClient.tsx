"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageContainer } from "@/styles/layout.styles";
import { createListAction } from "@/features/list/list.actions";
import { Drawer } from "@/components/Drawer/Drawer";
import { DrawerContent } from "@/components/Drawer/DrawerContent";
import { token } from "@/styled-system/tokens";
import { MapPin, PlusIcon } from "lucide-react";
import { styled } from "@/styled-system/jsx";
import {
  ItemCount,
  ItemCountContainer,
  ProgressBar,
  ProgressBarLabel,
} from "@/components/ListCard";
import { ListWithRelations } from "./page";
import { Button } from "@/components/Button/Button";
import { getItemsAction } from "@/features/item/item.actions";
import ItemRow, { ItemWithCategory } from "../../items/ItemRow";
import {
  addToListAction,
  togglePackedAction,
} from "@/features/list-item/list-item.actions";

interface ListClientProps {
  initialList?: ListWithRelations;
}

const ListDetails = styled("div", {
  base: {
    marginTop: "-10px",
    marginBottom: "{spacing.4}",
    display: "flex",
  },
});

const FloatingButton = styled("div", {
  base: {
    position: "fixed",
    bottom: "50px",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    pointerEvents: "none",
    "& > *": {
      pointerEvents: "auto", // Keeps the actual button clickable
    },
  },
});

export default function ListClient({ initialList }: ListClientProps) {
  const addDrawerSettings = {
    snapPoints: [0.25, 0.5, 0.75, 1],
    defaultSnapPoint: 1,
  };
  const editDrawerSettings = {
    snapPoints: [0.25, 0.5],
    defaultSnapPoint: 0.25,
  };
  const router = useRouter();
  const [libraryItems, setLibraryItems] = useState<ItemWithCategory[]>([]);
  const [loadingLibraryItems, setLoadingLibraryItems] = useState(true);
  const [drawerSettings, setDrawerSettings] = useState(editDrawerSettings);
  const [isAddingItems, setIsAddingItems] = useState(false);
  const [showBottomCard, setShowBottomCard] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const itemCount = initialList?.items?.length ?? 0;
  const packedCount =
    initialList?.items?.filter((item) => item.isPacked).length ?? 0;
  const packedPercent = Math.round((packedCount / itemCount) * 100);

  useEffect(() => {
    async function fetchItems() {
      try {
        const itemsResult = await getItemsAction();
        if (itemsResult?.data) {
          setLibraryItems(itemsResult.data as ItemWithCategory[]);
        }
        console.log("itemsResult", itemsResult);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoadingLibraryItems(false);
      }
    }
    fetchItems();
  }, []);

  const handleSuccess = () => {
    setShowBottomCard(false);
    router.refresh();
  };

  const listInputs = [
    {
      id: "name",
      label: "List Name",
      type: "text",
      placeholder: "e.g. Summer Vacation",
      required: true,
      defaultValue: initialList?.name || "",
    },
    {
      id: "destination",
      label: "Destination",
      type: "text",
      placeholder: "e.g. Iceland",
      required: false,
      defaultValue: initialList?.destination || "",
    },
    {
      id: "dates",
      label: "Dates",
      type: "text",
      placeholder: "e.g. 2026",
      required: false,
      // defaultValue: initialList?.date || "",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.querySelector("#name") as HTMLInputElement;

    if (!form.checkValidity()) {
      console.log("Invalid form");
      setFieldErrors({
        name: !nameInput.validity.valid,
      });
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      destination: formData.get("destination") as string,
      tripDate: formData.get("tripDate")
        ? new Date(formData.get("tripDate") as string)
        : undefined,
      lengthOfStay: formData.get("lengthOfStay")
        ? parseInt(formData.get("lengthOfStay") as string)
        : undefined,
      isTemplate: formData.get("isTemplate") === "on",
    };

    const result = await createListAction(data);

    if (result?.data?.success) {
      handleSuccess();
      router.refresh();
    } else {
      setLoading(false);
    }
  }

  async function handleAddItems() {
    const selectedItems = libraryItems.filter((i) => i.isSelected);
    console.log("handle add items", selectedItems);

    setLoading(true);

    // const result = await createListAction(data);

    // if (result?.data?.success) {
    //   handleSuccess();
    //   router.refresh();
    // } else {
    //   setLoading(false);
    // }
  }

  console.log("initialList", initialList);

  async function handleAdd(item: ItemWithCategory) {
    const result = await addToListAction({
      listId: initialList.id,
      itemId: item.id,
    });

    if (result?.data?.success) {
      handleSuccess();
    } else {
      setLoading(false);
    }

    // setLibraryItems(
    //   libraryItems.map((i: ItemWithCategory) => {
    //     if (item.id === i.id) {
    //       i.isSelected = !i.isSelected;
    //     }
    //     return i;
    //   }),
    // );
  }

  async function handlePack(item: ItemWithCategory) {
    const result = await togglePackedAction({
      listItemId: item.id,
      isPacked: !item.isPacked,
    });

    if (result?.data?.success) {
      handleSuccess();
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      <Drawer
        key={isAddingItems ? "add-mode" : "edit-mode"}
        snapPoints={drawerSettings.snapPoints}
        defaultSnapPoint={drawerSettings.defaultSnapPoint}
        isOpen={showBottomCard}
        closeDrawer={() => setShowBottomCard(false)}
      >
        <DrawerContent
          heading={isAddingItems ? "Add Items to List" : "Update List"}
          onClose={() => setShowBottomCard(false)}
          inputs={isAddingItems ? [] : listInputs}
          button={{ text: "Update List", type: "submit" }}
          onSave={isAddingItems ? handleAddItems : handleSubmit}
          isLoading={loading}
          fieldErrors={fieldErrors}
        >
          <div style={{ marginTop: token("spacing.4") }}>
            {loadingLibraryItems
              ? "LOADING"
              : libraryItems.map((item) => {
                  return (
                    <ItemRow key={item.id} item={item} handleAdd={handleAdd} />
                  );
                })}
          </div>
        </DrawerContent>
      </Drawer>
      <PageContainer>
        <PageHeader
          text={initialList?.name ?? "Unknown"}
          button={{
            text: "Edit List",
            onClick: () => {
              setShowBottomCard(true);
              setIsAddingItems(false);
              setDrawerSettings(editDrawerSettings);
            },
          }}
        />
        <ListDetails>
          <div style={{ flex: "1 1 auto" }}>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                color: token("colors.gray.400"),
                gap: token("spacing.1"),
                fontSize: token("fontSizes.base"),
              }}
            >
              <MapPin color={token("colors.gray.400")} size={18} />
              {initialList?.destination ? initialList?.destination : "None"}
            </p>
          </div>
          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <ItemCountContainer>
              <ItemCount>{packedCount}</ItemCount> / {itemCount} items
            </ItemCountContainer>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ProgressBarLabel>
                {packedPercent ? packedPercent : 0}% Packed
              </ProgressBarLabel>
              <ProgressBar>
                <p
                  style={{
                    width: `${packedPercent}%`,
                    zIndex: 1,
                    backgroundColor: token("colors.accent"),
                  }}
                ></p>
              </ProgressBar>
            </div>
          </div>
        </ListDetails>
        <div style={{ paddingBottom: token("spacing.24") }}>
          {initialList?.items?.map((item) => {
            return (
              <ItemRow
                key={item.id}
                item={{ ...item.item, ...item }}
                handlePack={handlePack}
              />
            );
          })}
        </div>
        <FloatingButton>
          <div>
            <Button
              text="Add Items"
              iconLeft={<PlusIcon />}
              radius="round"
              depth="floating"
              onClick={() => {
                setDrawerSettings(addDrawerSettings);
                setShowBottomCard(true);
                setIsAddingItems(true);
              }}
            />
          </div>
        </FloatingButton>
      </PageContainer>
    </>
  );
}
