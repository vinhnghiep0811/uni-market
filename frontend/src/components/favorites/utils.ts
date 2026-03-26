import {
  MARKETPLACE_FALLBACK_IMAGE,
  buildMarketplaceCategory,
} from "@/components/marketplace/browse/data";
import type { MarketplaceCategory } from "@/components/marketplace/browse/types";
import { BedDouble, BookOpen, Laptop, Package } from "lucide-react";

import type {
  FavoriteApiRecord,
  FavoriteCategoryFilter,
  FavoriteCategorySummary,
  FavoriteItem,
  FavoriteSortOption,
} from "./types";

const CATEGORY_LABELS: Record<FavoriteCategoryFilter, string> = {
  all: "All Items",
  textbooks: "Textbooks",
  electronics: "Electronics",
  furniture: "Furniture",
  others: "Others",
};

function normalizePrice(value: number | string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getSellerInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "UM";
}

function resolveCategoryFilter(name: string, slug: string): FavoriteCategoryFilter {
  const haystack = `${name} ${slug}`.toLowerCase();

  if (
    ["textbook", "book", "study", "note", "course", "material"].some((keyword) =>
      haystack.includes(keyword),
    )
  ) {
    return "textbooks";
  }

  if (
    ["electronic", "laptop", "phone", "tech", "device", "gadget"].some((keyword) =>
      haystack.includes(keyword),
    )
  ) {
    return "electronics";
  }

  if (
    ["furniture", "desk", "chair", "storage", "dorm", "room", "bedding"].some(
      (keyword) => haystack.includes(keyword),
    )
  ) {
    return "furniture";
  }

  return "others";
}

export function mapFavoriteItem(favorite: FavoriteApiRecord): FavoriteItem {
  const category = buildMarketplaceCategory(favorite.listing.category);
  const sellerName = favorite.listing.seller.fullName.trim() || "Campus seller";

  return {
    favoriteId: favorite.id,
    id: favorite.listing.id,
    title: favorite.listing.title,
    description: favorite.listing.description,
    price: normalizePrice(favorite.listing.price),
    savedAt: favorite.createdAt,
    categoryId: favorite.listing.categoryId,
    categoryName: favorite.listing.category.name,
    categoryFilter: resolveCategoryFilter(
      favorite.listing.category.name,
      favorite.listing.category.slug,
    ),
    categoryBadgeClassName: category.badgeClassName,
    imageSrc: favorite.listing.images[0]?.imageUrl ?? MARKETPLACE_FALLBACK_IMAGE,
    imageAlt: favorite.listing.title,
    seller: {
      name: sellerName,
      initials: getSellerInitials(sellerName),
      avatarUrl: favorite.listing.seller.avatarUrl,
      locationLabel: favorite.listing.location?.trim() || "Campus meetup",
    },
  };
}

export function buildFavoriteCategorySummaries(
  items: FavoriteItem[],
): FavoriteCategorySummary[] {
  const counts = items.reduce<Record<FavoriteCategoryFilter, number>>(
    (accumulator, item) => {
      accumulator[item.categoryFilter] += 1;
      accumulator.all += 1;
      return accumulator;
    },
    {
      all: 0,
      textbooks: 0,
      electronics: 0,
      furniture: 0,
      others: 0,
    },
  );

  return (Object.keys(CATEGORY_LABELS) as FavoriteCategoryFilter[]).map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    count: counts[key],
  }));
}

const FILTER_THEME = {
  all: {
    icon: Package,
    iconColorClassName: "bg-slate-200 text-slate-700",
    badgeClassName: "bg-slate-200 text-slate-700",
  },
  textbooks: {
    icon: BookOpen,
    iconColorClassName: "bg-blue-100 text-blue-700",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  electronics: {
    icon: Laptop,
    iconColorClassName: "bg-violet-100 text-violet-700",
    badgeClassName: "bg-violet-100 text-violet-700",
  },
  furniture: {
    icon: BedDouble,
    iconColorClassName: "bg-emerald-100 text-emerald-700",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  others: {
    icon: Package,
    iconColorClassName: "bg-amber-100 text-amber-700",
    badgeClassName: "bg-amber-100 text-amber-700",
  },
} as const;

export function buildFavoriteSidebarCategories(
  summaries: FavoriteCategorySummary[],
): MarketplaceCategory[] {
  return summaries.map((summary) => {
    const theme = FILTER_THEME[summary.key];
    const countLabel =
      summary.count === 1 ? "1 saved item" : `${summary.count} saved items`;

    return {
      id: summary.key,
      name: summary.label,
      description: countLabel,
      icon: theme.icon,
      iconColorClassName: theme.iconColorClassName,
      badgeClassName: theme.badgeClassName,
    };
  });
}

export function sortFavoriteItems(
  items: FavoriteItem[],
  sortOption: FavoriteSortOption,
) {
  const nextItems = [...items];

  nextItems.sort((left, right) => {
    if (sortOption === "Price: Low to High") {
      return left.price - right.price;
    }

    if (sortOption === "Price: High to Low") {
      return right.price - left.price;
    }

    return new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime();
  });

  return nextItems;
}
