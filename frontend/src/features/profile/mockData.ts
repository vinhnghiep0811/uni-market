import type { AuthUser } from "@/types/auth";

import type { ProfileListing, ProfileUserViewModel } from "./types";

function createListings(): ProfileListing[] {
  return [
    {
      id: "profile-listing-1",
      title: "Linear Algebra Textbook with solved exercise notes",
      description:
        "Clean copy with summary sheets attached for final exam revision.",
      price: 280000,
      imageSrc: "/images/download.jpg",
      imageAlt: "Linear algebra textbook",
      categoryLabel: "Textbooks & Study Materials",
      categoryClassName: "bg-blue-100 text-blue-700",
      status: "ACTIVE",
      updatedAtLabel: "Updated 2 hours ago",
    },
    {
      id: "profile-listing-2",
      title: "Study desk lamp with adjustable brightness",
      description:
        "Compact lamp for dorm desks, includes warm and cool light modes.",
      price: 220000,
      imageSrc: "/images/download.jpg",
      imageAlt: "Desk lamp on a study table",
      categoryLabel: "Dorm Essentials",
      categoryClassName: "bg-emerald-100 text-emerald-700",
      status: "ACTIVE",
      updatedAtLabel: "Updated yesterday",
    },
    {
      id: "profile-listing-3",
      title: "Portable rice cooker for dorm meals",
      description:
        "Small cooker in good condition, perfect for noodles and rice bowls.",
      price: 430000,
      imageSrc: "/images/download.jpg",
      imageAlt: "Portable rice cooker",
      categoryLabel: "Home Appliances",
      categoryClassName: "bg-amber-100 text-amber-700",
      status: "SOLD",
      updatedAtLabel: "Marked sold 3 days ago",
    },
    {
      id: "profile-listing-4",
      title: "Second-hand wireless headphones",
      description:
        "Comfortable fit with clear audio, includes original charging cable.",
      price: 890000,
      imageSrc: "/images/download.jpg",
      imageAlt: "Wireless headphones",
      categoryLabel: "Electronics",
      categoryClassName: "bg-violet-100 text-violet-700",
      status: "ARCHIVED",
      updatedAtLabel: "Archived last week",
    },
  ];
}

export function buildProfileUser(authUser: AuthUser): ProfileUserViewModel {
  return {
    id: authUser.id,
    fullName: authUser.fullName,
    email: authUser.email,
    phoneNumber: authUser.phoneNumber,
    facebookLink: authUser.facebookLink,
    avatarUrl: authUser.avatarUrl,
    createdAt: authUser.createdAt,
    listings: createListings(),
  };
}
