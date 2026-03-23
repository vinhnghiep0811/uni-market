import type { ProfileContactState, ProfileFormErrors } from "./types";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const joinedDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function formatVndPrice(value: number) {
  return currencyFormatter.format(value);
}

export function formatJoinedDate(date: string) {
  return joinedDateFormatter.format(new Date(date));
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function buildPhoneHref(phoneNumber: string) {
  return `tel:${phoneNumber.replace(/\s+/g, "")}`;
}

export function normalizeFacebookLink(link: string) {
  if (!link) {
    return "";
  }

  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }

  return `https://${link}`;
}

export function validateProfileForm(values: ProfileContactState) {
  const errors: ProfileFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (values.phoneNumber.trim() && !/^[\d+\s()-]{8,20}$/.test(values.phoneNumber)) {
    errors.phoneNumber = "Enter a valid phone number.";
  }

  if (values.facebookLink.trim()) {
    try {
      new URL(normalizeFacebookLink(values.facebookLink.trim()));
    } catch {
      errors.facebookLink = "Enter a valid Facebook link.";
    }
  }

  if (values.avatarUrl.trim()) {
    try {
      new URL(values.avatarUrl.trim());
    } catch {
      errors.avatarUrl = "Enter a valid image URL.";
    }
  }

  return errors;
}
