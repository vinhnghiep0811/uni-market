export type ProfileTab = "my-listings" | "archived-sold";

export type ProfileListingStatus = "ACTIVE" | "ARCHIVED" | "SOLD";

export type ProfileListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  categoryLabel: string;
  categoryClassName: string;
  status: ProfileListingStatus;
  updatedAtLabel: string;
};

export type ProfileContactState = {
  fullName: string;
  phoneNumber: string;
  facebookLink: string;
  avatarUrl: string;
};

export type ProfileUserViewModel = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  facebookLink?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  listings: ProfileListing[];
};

export type ProfileFormErrors = Partial<
  Record<keyof ProfileContactState, string>
>;
