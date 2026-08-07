import { styled } from "@/styled-system/jsx";
import { Category } from "@/generated/prisma/browser";
import { Icon } from "@/components/Icon";
import { FALLBACK_CATEGORY_COLOR } from "@/features/category/category.constants";

export interface CategoryProps {
  category: Category;
  iconSize?: number;
  size?: "base" | "small" | "medium" | "large";
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
  variants: {
    size: {
      base: {
        fontSize: "{fontSizes.base}",
        paddingInline: "{spacing.2}",
        paddingBlock: "{spacing.1}",
      },
      small: {
        fontSize: "{fontSizes.sm}",
      },
      medium: {
        fontSize: "{fontSizes.md}",
      },
      large: {
        fontSize: "{fontSizes.lg}",
      },
    },
  },
  defaultVariants: {
    size: "base",
  },
});

const determineIconSize = (size: string) => {
  switch (size) {
    case "base":
      return 18;
    case "small":
      return 16;
    case "medium":
      return 20;
    case "large":
      return 22;
    default:
      return 18;
  }
};

export function CategoryLabel({
  category,
  size = "base",
  iconSize,
  ...props
}: CategoryProps) {
  const primaryColor = category.color
    ? category.color
    : FALLBACK_CATEGORY_COLOR;
  const backgroundColor = `${primaryColor}40`;
  if (!iconSize) {
    iconSize = determineIconSize(size);
  }
  return (
    <CategoryStyled
      {...props}
      size={size}
      style={{ backgroundColor: backgroundColor, borderColor: primaryColor }}
    >
      <Icon value={category.icon} color={primaryColor} size={iconSize} />
      {category.name}
    </CategoryStyled>
  );
}
