export type ListingStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "IN_TRANSACTION"
  | "SOLD"
  | "HIDDEN";

export type TransactionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type TransactionParticipantApi = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  facebookLink?: string | null;
};

export type TransactionListingApi = {
  id: string;
  title: string;
  price: number | string;
  status: ListingStatus;
  images: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;
  condition?: string;
  location?: string | null;
};

export type TransactionApi = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: TransactionStatus;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  listing: TransactionListingApi;
  buyer?: TransactionParticipantApi;
  seller?: TransactionParticipantApi;
};

export type TransactionListResponse = {
  message: string;
  data: TransactionApi[];
};

export type TransactionMutationResponse = {
  message: string;
  data?: TransactionApi;
};

export function isActiveTransactionStatus(status: TransactionStatus) {
  return status === "PENDING" || status === "ACCEPTED";
}

export function normalizePrice(value: number | string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}
