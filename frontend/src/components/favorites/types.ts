import type { MarketplaceCategoryApi } from "@/components/marketplace/browse/types";

export type FavoriteSortOption =
  | "Recently Saved"
  | "Price: Low to High"
  | "Price: High to Low";

export type FavoriteCategoryFilter =
  | "all"
  | "textbooks"
  | "electronics"
  | "furniture"
  | "others";

export type FavoriteApiRecord = {
  id: string;
  listingId: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    description: string;
    price: number | string;
    location: string | null;
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
};

export type FavoriteItem = {
  favoriteId: string;
  id: string;
  title: string;
  description: string;
  price: number;
  savedAt: string;
  categoryId: string;
  categoryName: string;
  categoryFilter: FavoriteCategoryFilter;
  categoryBadgeClassName: string;
  imageSrc: string;
  imageAlt: string;
  seller: {
    name: string;
    initials: string;
    avatarUrl: string | null;
    locationLabel: string;
  };
};

export type FavoriteCategorySummary = {
  key: FavoriteCategoryFilter;
  label: string;
  count: number;
};
