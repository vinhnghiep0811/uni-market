import type {
  ListingConditionValue,
  ListingFormValues,
} from "@/components/marketplace/create-listing/types";
import type { ProfileListing } from "@/features/profile/types";
import type { ListingStatus } from "@/lib/transactions";

export type ManagedProfileListingApi = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  condition: ListingConditionValue;
  status: ListingStatus;
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
  backendStatus: ListingStatus;
  condition: ListingConditionValue;
  location: string;
  contactNote: string;
};

export type ManagedListingEditorState = ListingFormValues;
