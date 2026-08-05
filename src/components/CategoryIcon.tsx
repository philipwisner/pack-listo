import type { ComponentType } from "react";
import {
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
  type LucideProps,
  ListChecks,
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
};

// 2. Helper function to safely resolve and return the React Component
export const getCategoryIcon = (iconName?: string | null): IconComponent => {
  if (iconName && iconName in ALLOWED_ICONS) {
    return ALLOWED_ICONS[iconName];
  }
  console.log("iconName", iconName);

  return CircleHelp;
};

// 3. Simple wrapper component for JSX rendering
interface CategoryIconProps extends LucideProps {
  value?: string | null;
}

export function CategoryIcon({ value, ...props }: CategoryIconProps) {
  const Icon = getCategoryIcon(value);
  return <Icon {...props} />;
}
