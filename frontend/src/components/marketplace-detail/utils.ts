import type {
  ListingDetailApi,
  ListingDetailCondition,
  ListingDetailStatus,
  ListingDetailViewModel,
} from "./types";

export const LISTING_FALLBACK_IMAGE = "/images/download.jpg";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatVndPrice(value: number) {
  return currencyFormatter.format(value);
}

function formatRelativeTime(value: string) {
  const createdAt = new Date(value).getTime();

  if (Number.isNaN(createdAt)) {
    return "Recently posted";
  }

  const diffInSeconds = Math.round((createdAt - Date.now()) / 1000);
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

function formatConditionLabel(condition: ListingDetailCondition) {
  switch (condition) {
    case "NEW":
      return "New";
    case "LIKE_NEW":
      return "Like New";
    case "GOOD":
      return "Good";
    case "FAIR":
      return "Fair";
    case "POOR":
      return "Poor";
    default:
      return condition;
  }
}

function getStatusPresentation(status: ListingDetailStatus) {
  switch (status) {
    case "PUBLISHED":
      return {
        statusLabel: "Published",
        availabilityLabel: "Available",
        statusBadgeClassName: "bg-emerald-500/90 text-white shadow-lg shadow-emerald-950/20",
      };
    case "RESERVED":
      return {
        statusLabel: "Reserved",
        availabilityLabel: "Reserved",
        statusBadgeClassName: "bg-amber-400/95 text-amber-950 shadow-lg shadow-amber-950/10",
      };
    case "SOLD":
      return {
        statusLabel: "Sold",
        availabilityLabel: "Sold",
        statusBadgeClassName: "bg-slate-700/90 text-white shadow-lg shadow-slate-950/25",
      };
    case "DRAFT":
      return {
        statusLabel: "Draft",
        availabilityLabel: "Draft",
        statusBadgeClassName: "bg-slate-500/90 text-white shadow-lg shadow-slate-950/20",
      };
    case "HIDDEN":
      return {
        statusLabel: "Hidden",
        availabilityLabel: "Hidden",
        statusBadgeClassName: "bg-slate-500/90 text-white shadow-lg shadow-slate-950/20",
      };
    default:
      return {
        statusLabel: status,
        availabilityLabel: status,
        statusBadgeClassName: "bg-slate-500/90 text-white shadow-lg shadow-slate-950/20",
      };
  }
}

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

export function normalizeExternalUrl(value: string | null) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

export function shouldAllowDescriptionExpand(description: string) {
  return description.trim().length > 260 || description.includes("\n");
}

export function mapListingDetail(listing: ListingDetailApi): ListingDetailViewModel {
  const price = normalizePrice(listing.price);
  const statusPresentation = getStatusPresentation(listing.status);
  const images =
    listing.images.length > 0
      ? listing.images.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
        }))
      : [
          {
            id: "fallback-image",
            imageUrl: LISTING_FALLBACK_IMAGE,
          },
        ];

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price,
    isFavorited: listing.isFavorited,
    originalPrice: null,
    discountPercentage: null,
    conditionLabel: formatConditionLabel(listing.condition),
    conditionValue: listing.condition,
    postedTimeLabel: formatRelativeTime(listing.createdAt),
    location: listing.location,
    categoryName: listing.category.name,
    statusLabel: statusPresentation.statusLabel,
    availabilityLabel: statusPresentation.availabilityLabel,
    statusBadgeClassName: statusPresentation.statusBadgeClassName,
    contactNote: listing.contactNote,
    images,
    seller: {
      id: listing.seller.id,
      fullName: listing.seller.fullName,
      initials: getSellerInitials(listing.seller.fullName),
      phoneNumber: listing.seller.phoneNumber,
      facebookLink: normalizeExternalUrl(listing.seller.facebookLink),
      avatarUrl: listing.seller.avatarUrl,
    },
  };
}
