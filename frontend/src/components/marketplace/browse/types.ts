import type { LucideIcon } from "lucide-react";

export type MarketplaceCondition = "All" | "New" | "Like New" | "Used";

export type SortOption =
  | "Newest"
  | "Price: Low to High"
  | "Price: High to Low";

export type MarketplaceCategory = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconColorClassName: string;
  badgeClassName: string;
};

export type MarketplaceSeller = {
  name: string;
  initials: string;
  avatarClassName: string;
};

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  condition: Exclude<MarketplaceCondition, "All">;
  imageSrc: string;
  imageAlt: string;
  imagePosition: string;
  imageOverlayClassName: string;
  seller: MarketplaceSeller;
  listedAtLabel: string;
  createdAt: string;
};
