export type ListingDetailCondition =
  | "NEW"
  | "LIKE_NEW"
  | "GOOD"
  | "FAIR"
  | "POOR";

export type ListingDetailStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "RESERVED"
  | "SOLD"
  | "HIDDEN";

export type ListingDetailApi = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  isFavorited: boolean;
  condition: ListingDetailCondition;
  status: ListingDetailStatus;
  location: string | null;
  contactNote: string | null;
  categoryId: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  seller: {
    id: string;
    fullName: string;
    phoneNumber: string | null;
    facebookLink: string | null;
    avatarUrl: string | null;
  };
  images: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;
};

export type ListingDetailImage = {
  id: string;
  imageUrl: string;
};

export type ListingDetailViewModel = {
  id: string;
  title: string;
  description: string;
  price: number;
  isFavorited: boolean;
  originalPrice: number | null;
  discountPercentage: number | null;
  conditionLabel: string;
  conditionValue: ListingDetailCondition;
  postedTimeLabel: string;
  location: string | null;
  categoryName: string;
  statusLabel: string;
  availabilityLabel: string;
  statusBadgeClassName: string;
  contactNote: string | null;
  images: ListingDetailImage[];
  seller: {
    id: string;
    fullName: string;
    initials: string;
    phoneNumber: string | null;
    facebookLink: string | null;
    avatarUrl: string | null;
  };
};
