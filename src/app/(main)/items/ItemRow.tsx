"use client";
import { Item, Category } from "@/generated/prisma/browser";
import {
  InlineButtonsContainer,
  ListItemContainer,
} from "@/styles/layout.styles";
import { Button } from "@/components/Button/Button";
import { Check, Pencil, PlusIcon, Trash2, X } from "lucide-react";
import { CategoryLabel } from "@/components/CategoryLabel";
import { token } from "@/styled-system/tokens";

export type ItemWithCategory = Item & {
  isSelected: boolean;
  isPacked: boolean;
} & {
  category: Category | null;
};

interface ItemsClientProps {
  item: ItemWithCategory;
  handleEdit?: (item: ItemWithCategory) => void;
  handleDelete?: (item: ItemWithCategory) => void;
  handleAdd?: (item: ItemWithCategory) => void;
  handlePack?: (item: ItemWithCategory) => void;
}

export default function ItemRow({
  item,
  handleEdit,
  handleDelete,
  handleAdd,
  handlePack,
}: ItemsClientProps) {
  return (
    <ListItemContainer>
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
        {handleAdd && (
          <Button
            text={item.isSelected ? "Remove" : "Add"}
            variant={item.isSelected ? "delete" : "secondary"}
            size="small"
            width="fit"
            onClick={() => handleAdd(item)}
            iconLeft={
              item.isSelected ? <X size={16} /> : <PlusIcon size={16} />
            }
          />
        )}
        {handlePack && (
          <Button
            text={item.isPacked ? "Unpack" : "Pack"}
            variant={item.isPacked ? "delete" : "secondary"}
            size="small"
            width="fit"
            onClick={() => handlePack(item)}
            iconLeft={item.isPacked ? <X size={16} /> : <PlusIcon size={16} />}
          />
        )}
        {handleEdit && (
          <Button
            text="Edit"
            variant="secondary"
            size="small"
            width="fit"
            onClick={() => handleEdit(item)}
            iconLeft={<Pencil size={16} />}
          />
        )}
        {handleDelete && (
          <Button
            text="Delete"
            variant="delete"
            size="small"
            width="fit"
            onClick={() => handleDelete(item)}
            iconLeft={<Trash2 size={16} />}
          />
        )}
      </InlineButtonsContainer>
    </ListItemContainer>
  );
}
