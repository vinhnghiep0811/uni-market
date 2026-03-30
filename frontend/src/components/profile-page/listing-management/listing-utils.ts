import { buildMarketplaceCategory } from "@/components/marketplace/browse/data";
import type { ListingFormValues } from "@/components/marketplace/create-listing/types";

import type {
  ManagedProfileListing,
  ManagedProfileListingApi,
} from "./types";
import type { ListingStatus } from "@/lib/transactions";

const PROFILE_FALLBACK_IMAGE = "/images/download.jpg";

function getPrimaryImageSrc(images: ManagedProfileListingApi["images"]) {
  const primaryImage = images.find((image) => image.imageUrl.trim().length > 0);
  return primaryImage?.imageUrl ?? PROFILE_FALLBACK_IMAGE;
}

function formatRelativeTime(value: string) {
  const updatedAt = new Date(value).getTime();

  if (Number.isNaN(updatedAt)) {
    return "recently";
  }

  const diffInSeconds = Math.round((updatedAt - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(diffInSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (absoluteSeconds < 60) {
    return formatter.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (absoluteSeconds < 60 * 60) {
    return formatter.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInSeconds / (60 * 60));
  if (absoluteSeconds < 60 * 60 * 24) {
    return formatter.format(diffInHours, "hour");
  }

  const diffInDays = Math.round(diffInSeconds / (60 * 60 * 24));
  if (absoluteSeconds < 60 * 60 * 24 * 30) {
    return formatter.format(diffInDays, "day");
  }

  const diffInMonths = Math.round(diffInSeconds / (60 * 60 * 24 * 30));
  if (absoluteSeconds < 60 * 60 * 24 * 365) {
    return formatter.format(diffInMonths, "month");
  }

  const diffInYears = Math.round(diffInSeconds / (60 * 60 * 24 * 365));
  return formatter.format(diffInYears, "year");
}

function mapBackendStatusToProfileStatus(
  status: ListingStatus,
) {
  if (status === "SOLD") {
    return "SOLD" as const;
  }

  if (status === "DRAFT" || status === "HIDDEN") {
    return "ARCHIVED" as const;
  }

  return "ACTIVE" as const;
}

function buildUpdatedAtLabel(status: ManagedProfileListing["status"], updatedAt: string) {
  const relativeLabel = formatRelativeTime(updatedAt);

  if (status === "SOLD") {
    return `Marked sold ${relativeLabel}`;
  }

  if (status === "ARCHIVED") {
    return `Archived ${relativeLabel}`;
  }

  return `Updated ${relativeLabel}`;
}

function normalizePrice(value: number | string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function mapManagedProfileListing(
  listing: ManagedProfileListingApi,
): ManagedProfileListing {
  const visualCategory = buildMarketplaceCategory(listing.category);
  const status = mapBackendStatusToProfileStatus(listing.status);

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: normalizePrice(listing.price),
    imageSrc: getPrimaryImageSrc(listing.images),
    imageAlt: listing.title,
    categoryId: listing.categoryId,
    backendStatus: listing.status,
    categoryLabel: listing.category.name,
    categoryClassName: visualCategory.badgeClassName,
    condition: listing.condition,
    location: listing.location ?? "",
    contactNote: listing.contactNote ?? "",
    status,
    updatedAtLabel: buildUpdatedAtLabel(status, listing.updatedAt),
  };
}

export function buildManagedListingEditorState(
  listing: ManagedProfileListing,
): ListingFormValues {
  return {
    title: listing.title,
    description: listing.description,
    price: String(listing.price),
    categoryId: listing.categoryId,
    condition: listing.condition,
    location: listing.location,
    contactNote: listing.contactNote,
  };
}

export function buildUpdateListingPayload(values: ListingFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    price: values.price.trim(),
    categoryId: values.categoryId,
    condition: values.condition,
    location: values.location.trim(),
    contactNote: values.contactNote.trim(),
  };
}
