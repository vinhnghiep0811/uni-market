import type {
  ListingConditionValue,
  ListingFormValues,
} from "@/components/marketplace/create-listing/types";
import type { ProfileListing } from "@/features/profile/types";

export type ManagedProfileListingApiStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "RESERVED"
  | "SOLD"
  | "HIDDEN";

export type ManagedProfileListingApi = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  condition: ListingConditionValue;
  status: ManagedProfileListingApiStatus;
  location: string | null;
  contactNote: string | null;
  categoryId: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  images: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;
};

export type ManagedProfileListing = ProfileListing & {
  categoryId: string;
  condition: ListingConditionValue;
  location: string;
  contactNote: string;
};

export type ManagedListingEditorState = ListingFormValues;
