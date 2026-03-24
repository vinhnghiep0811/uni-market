export type ListingConditionValue =
  | "NEW"
  | "LIKE_NEW"
  | "GOOD"
  | "FAIR"
  | "POOR";

export type ListingCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type ListingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export type ListingFormValues = {
  title: string;
  description: string;
  price: string;
  categoryId: string;
  condition: ListingConditionValue | "";
  location: string;
  contactNote: string;
};

export type ListingFormFieldName = keyof ListingFormValues | "images" | "form";

export type ListingFormErrors = Partial<Record<ListingFormFieldName, string>>;

export type SubmissionAction = "draft" | "publish" | null;

export type FeedbackTone = "success" | "error" | "info";
