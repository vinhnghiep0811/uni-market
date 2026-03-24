import type { ListingConditionValue, ListingFormValues } from "./types";

export const TITLE_MIN_LENGTH = 5;
export const TITLE_MAX_LENGTH = 150;
export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 5000;
export const LOCATION_MAX_LENGTH = 255;
export const CONTACT_NOTE_MAX_LENGTH = 500;
export const MAX_IMAGES = 10;

export const INITIAL_FORM_VALUES: ListingFormValues = {
  title: "",
  description: "",
  price: "",
  categoryId: "",
  condition: "",
  location: "",
  contactNote: "",
};

export const CONDITION_OPTIONS: Array<{
  value: ListingConditionValue;
  label: string;
  description: string;
}> = [
  {
    value: "NEW",
    label: "New",
    description: "Unused or still in original packaging.",
  },
  {
    value: "LIKE_NEW",
    label: "Like New",
    description: "Very lightly used with minimal signs of wear.",
  },
  {
    value: "GOOD",
    label: "Good",
    description: "Fully functional and well maintained for student use.",
  },
  {
    value: "FAIR",
    label: "Fair",
    description: "Visible wear, but still works as expected.",
  },
  {
    value: "POOR",
    label: "Poor",
    description: "Heavily used and best for low-price resale or spare parts.",
  },
];

