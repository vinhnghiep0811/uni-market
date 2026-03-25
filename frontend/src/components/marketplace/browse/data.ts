import {
  BedDouble,
  BookOpen,
  Home,
  Laptop,
  Package,
} from "lucide-react";

import type {
  MarketplaceCategory,
  MarketplaceCategoryApi,
  MarketplaceCondition,
  MarketplaceListingApi,
  MarketplaceListingCondition,
  MarketplaceProduct,
  SortOption,
} from "./types";

export const MARKETPLACE_FALLBACK_IMAGE = "/images/download.jpg";
export const MARKETPLACE_MAX_PRICE = 10_000_000;
export const MARKETPLACE_PAGE_SIZE = 8;
export const MARKETPLACE_FETCH_LIMIT = 50;

export const SORT_OPTIONS: SortOption[] = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

export const CONDITION_OPTIONS: MarketplaceCondition[] = [
  "All",
  "New",
  "Like New",
  "Used",
];

const CATEGORY_THEMES = [
  {
    matches: ["textbook", "book", "study", "note", "course", "material"],
    icon: BookOpen,
    iconColorClassName: "bg-blue-100 text-blue-700",
    badgeClassName: "bg-blue-100 text-blue-700",
    sellerAvatarClassName: "bg-blue-100 text-blue-700",
    imageOverlayClassName:
      "bg-gradient-to-t from-blue-950/55 via-blue-950/10 to-transparent",
  },
  {
    matches: ["electronic", "laptop", "phone", "tech", "device", "gadget"],
    icon: Laptop,
    iconColorClassName: "bg-violet-100 text-violet-700",
    badgeClassName: "bg-violet-100 text-violet-700",
    sellerAvatarClassName: "bg-violet-100 text-violet-700",
    imageOverlayClassName:
      "bg-gradient-to-t from-violet-950/60 via-violet-950/15 to-transparent",
  },
  {
    matches: ["home", "appliance", "kitchen", "cook", "household"],
    icon: Home,
    iconColorClassName: "bg-amber-100 text-amber-700",
    badgeClassName: "bg-amber-100 text-amber-700",
    sellerAvatarClassName: "bg-amber-100 text-amber-700",
    imageOverlayClassName:
      "bg-gradient-to-t from-amber-950/55 via-amber-950/10 to-transparent",
  },
  {
    matches: ["dorm", "room", "bedding", "storage", "essential", "furniture"],
    icon: BedDouble,
    iconColorClassName: "bg-emerald-100 text-emerald-700",
    badgeClassName: "bg-emerald-100 text-emerald-700",
    sellerAvatarClassName: "bg-emerald-100 text-emerald-700",
    imageOverlayClassName:
      "bg-gradient-to-t from-emerald-950/55 via-emerald-950/10 to-transparent",
  },
  {
    matches: [],
    icon: Package,
    iconColorClassName: "bg-slate-200 text-slate-700",
    badgeClassName: "bg-slate-200 text-slate-700",
    sellerAvatarClassName: "bg-slate-200 text-slate-700",
    imageOverlayClassName:
      "bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent",
  },
] as const;

function resolveCategoryTheme(category: MarketplaceCategoryApi) {
  const haystack = `${category.slug} ${category.name}`.toLowerCase();

  return (
    CATEGORY_THEMES.find((theme) =>
      theme.matches.some((keyword) => haystack.includes(keyword)),
    ) ?? CATEGORY_THEMES[CATEGORY_THEMES.length - 1]
  );
}

function formatCategoryDescription(category: MarketplaceCategoryApi) {
  return category.description?.trim() || "Useful finds shared around campus.";
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

function normalizePrice(value: number | string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatRelativeTime(value: string) {
  const createdAt = new Date(value).getTime();

  if (Number.isNaN(createdAt)) {
    return "Recently listed";
  }

  const diffInSeconds = Math.round((createdAt - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(diffInSeconds);
  const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (absoluteSeconds < 60) {
    return relativeTimeFormat.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (absoluteSeconds < 60 * 60) {
    return relativeTimeFormat.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInSeconds / (60 * 60));
  if (absoluteSeconds < 60 * 60 * 24) {
    return relativeTimeFormat.format(diffInHours, "hour");
  }

  const diffInDays = Math.round(diffInSeconds / (60 * 60 * 24));
  if (absoluteSeconds < 60 * 60 * 24 * 30) {
    return relativeTimeFormat.format(diffInDays, "day");
  }

  const diffInMonths = Math.round(diffInSeconds / (60 * 60 * 24 * 30));
  if (absoluteSeconds < 60 * 60 * 24 * 365) {
    return relativeTimeFormat.format(diffInMonths, "month");
  }

  const diffInYears = Math.round(diffInSeconds / (60 * 60 * 24 * 365));
  return relativeTimeFormat.format(diffInYears, "year");
}

export function mapListingCondition(
  condition: MarketplaceListingCondition,
): Exclude<MarketplaceCondition, "All"> {
  switch (condition) {
    case "NEW":
      return "New";
    case "LIKE_NEW":
      return "Like New";
    default:
      return "Used";
  }
}

export function buildMarketplaceCategory(
  category: MarketplaceCategoryApi,
): MarketplaceCategory {
  const theme = resolveCategoryTheme(category);

  return {
    id: category.id,
    name: category.name,
    description: formatCategoryDescription(category),
    icon: theme.icon,
    iconColorClassName: theme.iconColorClassName,
    badgeClassName: theme.badgeClassName,
  };
}

export function buildMarketplaceCategories(categories: MarketplaceCategoryApi[]) {
  return categories
    .map(buildMarketplaceCategory)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function buildMarketplaceCategoriesById(
  categories: MarketplaceCategoryApi[],
) {
  return Object.fromEntries(
    categories.map((category) => [
      category.id,
      buildMarketplaceCategory(category),
    ]),
  ) as Record<string, MarketplaceCategory>;
}

export function mapListingToMarketplaceProduct(
  listing: MarketplaceListingApi,
): MarketplaceProduct {
  const theme = resolveCategoryTheme(listing.category);
  const sellerName = listing.seller.fullName?.trim() || "Campus seller";

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: normalizePrice(listing.price),
    categoryId: listing.categoryId,
    categoryName: listing.category.name,
    condition: mapListingCondition(listing.condition),
    imageSrc: MARKETPLACE_FALLBACK_IMAGE,
    imageAlt: listing.title,
    imagePosition: "center",
    imageOverlayClassName: theme.imageOverlayClassName,
    seller: {
      name: sellerName,
      initials: getSellerInitials(sellerName),
      avatarClassName: theme.sellerAvatarClassName,
    },
    listedAtLabel: formatRelativeTime(listing.createdAt),
    createdAt: listing.createdAt,
  };
}
