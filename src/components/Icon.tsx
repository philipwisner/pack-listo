import type { ComponentType } from "react";
import { styled } from "@/styled-system/jsx";
import { token } from "@/styled-system/tokens";
import {
  type LucideProps,
  Watch,
  Cable,
  Shirt,
  FileText,
  Smartphone,
  Gamepad2,
  Activity,
  Package,
  Droplet,
  CircleHelp,
  ListChecks,
  Parasol,
  Camera,
  Backpack,
  Luggage,
  Handbag,
  Briefcase,
  Bath,
  Plane,
  Hand,
  Baby,
  Shell,
} from "lucide-react";

// 1. Type the Icon component using LucideProps
type IconComponent = ComponentType<LucideProps>;

export const ALLOWED_ICONS: Record<string, IconComponent> = {
  watch: Watch,
  cable: Cable,
  shirt: Shirt,
  "file-text": FileText,
  smartphone: Smartphone,
  "gamepad-2": Gamepad2,
  activity: Activity,
  package: Package,
  droplet: Droplet,
  "list-checks": ListChecks,
  parasol: Parasol,
  camera: Camera,
  backpack: Backpack,
  luggage: Luggage,
  handbag: Handbag,
  briefcase: Briefcase,
  bath: Bath,
  plane: Plane,
  hand: Hand,
  baby: Baby,
  shell: Shell,
};

export const FALLBACK_ICON = "circle-help";

const getMatchingIcon = (iconName?: string | null): IconComponent => {
  if (iconName && iconName in ALLOWED_ICONS) {
    return ALLOWED_ICONS[iconName];
  }

  return CircleHelp;
};

interface IconProps extends LucideProps {
  value?: string | null;
}

export function Icon({ value, ...props }: IconProps) {
  const CustomIcon = getMatchingIcon(value);
  return <CustomIcon {...props} />;
}

export const IconLabelLink = styled("a", {
  base: {
    paddingInline: "{spacing.2}",
    paddingBlock: "{spacing.1}",
    fontSize: "{fontSizes.sm}",
    border: "thin solid",
    borderColor: "{colors.label}",
    borderRadius: "{radii.md}",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    gap: "{spacing.2}",
    _hover: {
      bg: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" },
      transform: "scale(1.01)",
    },
  },
});
