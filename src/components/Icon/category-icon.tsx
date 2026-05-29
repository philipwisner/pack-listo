import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

//Make an icon picker component but it dynamically load components to prevent large bundle size. Allow users to search for icons by name and show a preview of the icon. When an icon is selected, it should call a callback function with the selected icon name.

export const CATEGORY_ICONS = {
  Search: LucideIcons.Search,
  Sparkles: LucideIcons.Sparkles,
  Bath: LucideIcons.Bath,
  Waves: LucideIcons.Waves,
  Baby: LucideIcons.Baby,
  Wind: LucideIcons.Wind,
  Sun: LucideIcons.Sun,
  Camera: LucideIcons.Camera,
  Plug: LucideIcons.Plug,
  Pill: LucideIcons.Pill,
  Utensils: LucideIcons.Utensils,
  CreditCard: LucideIcons.CreditCard,
  Map: LucideIcons.Map,
  Briefcase: LucideIcons.Briefcase,
  HardDrive: LucideIcons.HardDrive,
  Book: LucideIcons.Book,
  Dumbbell: LucideIcons.Dumbbell,
  Compass: LucideIcons.Compass,
  Laptop: LucideIcons.Laptop,
  Smartphone: LucideIcons.Smartphone,
  Watch: LucideIcons.Watch,
  Umbrella: LucideIcons.Umbrella,
  Mountain: LucideIcons.Mountain,
  Palmtree: LucideIcons.Palmtree,
  Files: LucideIcons.Files,
  FileText: LucideIcons.FileText,
  StickyNote: LucideIcons.StickyNote,
  Globe: LucideIcons.Globe,
  Package: LucideIcons.Package,
  Asterisk: LucideIcons.Asterisk,
  MoreHorizontal: LucideIcons.MoreHorizontal,
  Infinity: LucideIcons.Infinity,
  Tag: LucideIcons.Tag,
  Shirt: LucideIcons.Shirt,
};

export type CategoryIconName = keyof typeof CATEGORY_ICONS;

export default function CategoryIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  if (!name || !(name in CATEGORY_ICONS)) {
    return <LucideIcons.Tag className={className} />;
  }

  const Icon = CATEGORY_ICONS[name as CategoryIconName] as LucideIcon;
  return <Icon className={className} />;
}
