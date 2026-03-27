import type { LucideIcon } from "lucide-react";

import type { ListingStatus, TransactionStatus } from "@/lib/transactions";

export type MarketplaceCondition = "All" | "New" | "Like New" | "Good" | "Fair" | "Poor";

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
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
};

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  isFavorited: boolean;
  categoryId: string;
  categoryName: string;
  condition: Exclude<MarketplaceCondition, "All">;
  imageSrc: string;
  imageAlt: string;
  imagePosition: string;
  imageOverlayClassName: string;
  seller: MarketplaceSeller;
  listedAtLabel: string;
  createdAt: string;
  status: ListingStatus;
  transactionStatus: TransactionStatus | null;
  isOwnedByCurrentUser: boolean;
};

export type MarketplaceCategoryApi = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type MarketplaceListingCondition =
  | "NEW"
  | "LIKE_NEW"
  | "GOOD"
  | "FAIR"
  | "POOR";

export type MarketplaceListingApi = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  isFavorited: boolean;
  condition: MarketplaceListingCondition;
  status: ListingStatus;
  categoryId: string;
  createdAt: string;
  category: MarketplaceCategoryApi;
  seller: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  images: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;
};

export type MarketplaceListingsResponse = {
  data: MarketplaceListingApi[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
