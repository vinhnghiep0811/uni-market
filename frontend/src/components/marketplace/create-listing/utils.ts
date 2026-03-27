import {
  CONTACT_NOTE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  LOCATION_MAX_LENGTH,
  MAX_IMAGES,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "./constants";
import type {
  ListingFormErrors,
  ListingFormValues,
} from "./types";

export function formatPricePreview(value: string) {
  if (!value) {
    return null;
  }

  return `${new Intl.NumberFormat("vi-VN").format(Number(value))} VND`;
}

export function validateListingForm(
  values: ListingFormValues,
  imageCount: number,
) {
  const errors: ListingFormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();
  const price = values.price.trim();
  const location = values.location.trim();
  const contactNote = values.contactNote.trim();

  if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
    errors.title = `Use ${TITLE_MIN_LENGTH} to ${TITLE_MAX_LENGTH} characters for a clear item title.`;
  }

  if (
    description.length < DESCRIPTION_MIN_LENGTH ||
    description.length > DESCRIPTION_MAX_LENGTH
  ) {
    errors.description = `Add ${DESCRIPTION_MIN_LENGTH} to ${DESCRIPTION_MAX_LENGTH} characters so buyers understand the item.`;
  }

  if (!/^\d+$/.test(price)) {
    errors.price = "Enter numbers only for the price.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Choose the closest category for your item.";
  }

  if (!values.condition) {
    errors.condition = "Select the item's condition.";
  }

  if (location.length > LOCATION_MAX_LENGTH) {
    errors.location = `Keep meetup details within ${LOCATION_MAX_LENGTH} characters.`;
  }

  if (contactNote.length > CONTACT_NOTE_MAX_LENGTH) {
    errors.contactNote = `Keep the contact note within ${CONTACT_NOTE_MAX_LENGTH} characters.`;
  }

  if (imageCount > MAX_IMAGES) {
    errors.images = `You can upload up to ${MAX_IMAGES} images.`;
  }

  return errors;
}

export function buildCreateListingPayload(
  values: ListingFormValues,
  imageUrls: string[] = [],
) {
  const title = values.title.trim();
  const description = values.description.trim();
  const price = values.price.trim();
  const location = values.location.trim();
  const contactNote = values.contactNote.trim();

  return {
    title,
    description,
    price,
    categoryId: values.categoryId,
    condition: values.condition,
    ...(location ? { location } : {}),
    ...(contactNote ? { contactNote } : {}),
    ...(imageUrls.length > 0 ? { imageUrls } : {}),
  };
}

