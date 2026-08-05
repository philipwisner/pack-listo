import { styled } from "@/styled-system/jsx";
import { Category } from "@/generated/prisma/browser";
import { Icon } from "@/components/Icon";
import { FALLBACK_CATEGORY_COLOR } from "@/features/category/category.constants";

export interface CategoryProps {
  category: Category;
  iconSize?: number;
}

const CategoryStyled = styled("div", {
  base: {
    border: `1px solid`,
    width: "fit-content",
    paddingInline: "{spacing.2}",
    paddingBlock: "{spacing.1}",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    gap: "{spacing.2}",
  },
});

export function CategoryLabel({
  category,
  iconSize = 18,
  ...props
}: CategoryProps) {
  const primaryColor = category.color
    ? category.color
    : FALLBACK_CATEGORY_COLOR;
  const backgroundColor = `${primaryColor}40`;
  return (
    <CategoryStyled
      {...props}
      style={{ backgroundColor: backgroundColor, borderColor: primaryColor }}
    >
      <Icon value={category.icon} color={primaryColor} size={iconSize} />
      {category.name}
    </CategoryStyled>
  );
}
