import {
  BedDouble,
  BookOpen,
  Home,
  Laptop,
  Package,
} from "lucide-react";

import type {
  MarketplaceCategory,
  MarketplaceProduct,
  MarketplaceCondition,
  SortOption,
} from "./types";

export const MARKETPLACE_MAX_PRICE = 10_000_000;
export const MARKETPLACE_PAGE_SIZE = 8;

export const SORT_OPTIONS: SortOption[] = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

export const CONDITION_OPTIONS: MarketplaceCondition[] = [
  "All",
  "New",
  "Like New",
  "Used",
];

export const marketplaceCategories: MarketplaceCategory[] = [
  {
    id: "textbooks-study-materials",
    name: "Textbooks & Study Materials",
    description: "Course books, review sheets, notes, and study kits.",
    icon: BookOpen,
    iconColorClassName: "bg-blue-100 text-blue-700",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Phones, laptops, headphones, and everyday tech.",
    icon: Laptop,
    iconColorClassName: "bg-violet-100 text-violet-700",
    badgeClassName: "bg-violet-100 text-violet-700",
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    description: "Compact appliances that make student life easier.",
    icon: Home,
    iconColorClassName: "bg-amber-100 text-amber-700",
    badgeClassName: "bg-amber-100 text-amber-700",
  },
  {
    id: "dorm-essentials",
    name: "Dorm Essentials",
    description: "Storage, lighting, bedding, and room setup basics.",
    icon: BedDouble,
    iconColorClassName: "bg-emerald-100 text-emerald-700",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "others",
    name: "Others",
    description: "Useful finds shared across your campus community.",
    icon: Package,
    iconColorClassName: "bg-slate-200 text-slate-700",
    badgeClassName: "bg-slate-200 text-slate-700",
  },
];

export const marketplaceCategoriesById = Object.fromEntries(
  marketplaceCategories.map((category) => [category.id, category]),
) as Record<string, MarketplaceCategory>;

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "listing-calculus-early-transcendentals",
    title: "Calculus Early Transcendentals 8th Edition with Notes",
    description:
      "Well-kept textbook bundle with highlighted formulas and final exam notes.",
    price: 320000,
    categoryId: "textbooks-study-materials",
    condition: "Used",
    imageSrc: "/images/download.jpg",
    imageAlt: "Calculus textbook bundle",
    imagePosition: "center 28%",
    imageOverlayClassName:
      "bg-gradient-to-t from-blue-950/55 via-blue-950/10 to-transparent",
    seller: {
      name: "An Nguyen",
      initials: "AN",
      avatarClassName: "bg-blue-100 text-blue-700",
    },
    listedAtLabel: "2 hours ago",
    createdAt: "2026-03-23T09:15:00.000Z",
  },
  {
    id: "listing-iphone-12-blue",
    title: "iPhone 12 128GB Blue with Charger and Case",
    description:
      "Battery health 87%, camera works perfectly, ideal for campus use.",
    price: 6900000,
    categoryId: "electronics",
    condition: "Like New",
    imageSrc: "/images/download.jpg",
    imageAlt: "iPhone 12 on a desk",
    imagePosition: "center 50%",
    imageOverlayClassName:
      "bg-gradient-to-t from-violet-950/60 via-violet-950/15 to-transparent",
    seller: {
      name: "Linh Tran",
      initials: "LT",
      avatarClassName: "bg-violet-100 text-violet-700",
    },
    listedAtLabel: "3 hours ago",
    createdAt: "2026-03-23T08:30:00.000Z",
  },
  {
    id: "listing-mini-rice-cooker",
    title: "Compact Rice Cooker for Dorm Rooms",
    description:
      "Easy to clean and perfect for quick meals in shared student housing.",
    price: 450000,
    categoryId: "home-appliances",
    condition: "Used",
    imageSrc: "/images/download.jpg",
    imageAlt: "Compact rice cooker",
    imagePosition: "center 35%",
    imageOverlayClassName:
      "bg-gradient-to-t from-amber-950/55 via-amber-950/10 to-transparent",
    seller: {
      name: "Minh Le",
      initials: "ML",
      avatarClassName: "bg-amber-100 text-amber-700",
    },
    listedAtLabel: "5 hours ago",
    createdAt: "2026-03-23T06:45:00.000Z",
  },
  {
    id: "listing-desk-lamp-usb",
    title: "LED Desk Lamp with USB Charging Port",
    description:
      "Adjustable brightness, slim profile, and perfect for late-night study sessions.",
    price: 280000,
    categoryId: "dorm-essentials",
    condition: "New",
    imageSrc: "/images/download.jpg",
    imageAlt: "LED desk lamp",
    imagePosition: "center 42%",
    imageOverlayClassName:
      "bg-gradient-to-t from-emerald-950/55 via-emerald-950/10 to-transparent",
    seller: {
      name: "Gia Vo",
      initials: "GV",
      avatarClassName: "bg-emerald-100 text-emerald-700",
    },
    listedAtLabel: "6 hours ago",
    createdAt: "2026-03-23T05:55:00.000Z",
  },
  {
    id: "listing-noise-cancelling-headphones",
    title: "Noise Cancelling Headphones for Study and Commute",
    description:
      "Comfortable fit with strong bass, includes case and charging cable.",
    price: 1350000,
    categoryId: "electronics",
    condition: "Like New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Noise cancelling headphones",
    imagePosition: "center 22%",
    imageOverlayClassName:
      "bg-gradient-to-t from-violet-950/60 via-violet-950/15 to-transparent",
    seller: {
      name: "Bao Ho",
      initials: "BH",
      avatarClassName: "bg-violet-100 text-violet-700",
    },
    listedAtLabel: "8 hours ago",
    createdAt: "2026-03-23T03:10:00.000Z",
  },
  {
    id: "listing-engineering-drawing-kit",
    title: "Engineering Drawing Kit with Compass and Scales",
    description:
      "Complete drafting set for first-year design and architecture students.",
    price: 190000,
    categoryId: "textbooks-study-materials",
    condition: "New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Engineering drawing kit",
    imagePosition: "center 58%",
    imageOverlayClassName:
      "bg-gradient-to-t from-blue-950/55 via-blue-950/10 to-transparent",
    seller: {
      name: "Phuc Dang",
      initials: "PD",
      avatarClassName: "bg-blue-100 text-blue-700",
    },
    listedAtLabel: "10 hours ago",
    createdAt: "2026-03-22T22:20:00.000Z",
  },
  {
    id: "listing-mini-fridge",
    title: "Mini Fridge for Shared Apartment or Dorm Space",
    description:
      "Runs quietly and keeps drinks cold without taking up much space.",
    price: 2300000,
    categoryId: "home-appliances",
    condition: "Used",
    imageSrc: "/images/download.jpg",
    imageAlt: "Mini fridge in a dorm room",
    imagePosition: "center 46%",
    imageOverlayClassName:
      "bg-gradient-to-t from-amber-950/55 via-amber-950/10 to-transparent",
    seller: {
      name: "Trang Do",
      initials: "TD",
      avatarClassName: "bg-amber-100 text-amber-700",
    },
    listedAtLabel: "12 hours ago",
    createdAt: "2026-03-22T20:40:00.000Z",
  },
  {
    id: "listing-storage-cart",
    title: "Rolling Storage Cart for Notes, Cables, and Snacks",
    description:
      "Three-tier cart that fits neatly beside a study desk or bunk bed.",
    price: 520000,
    categoryId: "dorm-essentials",
    condition: "Like New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Rolling storage cart",
    imagePosition: "center 60%",
    imageOverlayClassName:
      "bg-gradient-to-t from-emerald-950/55 via-emerald-950/10 to-transparent",
    seller: {
      name: "Nhi Bui",
      initials: "NB",
      avatarClassName: "bg-emerald-100 text-emerald-700",
    },
    listedAtLabel: "14 hours ago",
    createdAt: "2026-03-22T18:55:00.000Z",
  },
  {
    id: "listing-calculator-fx-580",
    title: "Casio fx-580VN X Scientific Calculator",
    description:
      "Exam-approved calculator in excellent condition with protective cover.",
    price: 380000,
    categoryId: "textbooks-study-materials",
    condition: "Like New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Scientific calculator",
    imagePosition: "center 34%",
    imageOverlayClassName:
      "bg-gradient-to-t from-blue-950/55 via-blue-950/10 to-transparent",
    seller: {
      name: "Khoa Pham",
      initials: "KP",
      avatarClassName: "bg-blue-100 text-blue-700",
    },
    listedAtLabel: "16 hours ago",
    createdAt: "2026-03-22T16:25:00.000Z",
  },
  {
    id: "listing-bluetooth-speaker",
    title: "Portable Bluetooth Speaker for Small Gatherings",
    description:
      "Clear sound, compact body, and enough battery for a weekend trip.",
    price: 740000,
    categoryId: "electronics",
    condition: "Used",
    imageSrc: "/images/download.jpg",
    imageAlt: "Portable bluetooth speaker",
    imagePosition: "center 65%",
    imageOverlayClassName:
      "bg-gradient-to-t from-violet-950/60 via-violet-950/15 to-transparent",
    seller: {
      name: "Vy Truong",
      initials: "VT",
      avatarClassName: "bg-violet-100 text-violet-700",
    },
    listedAtLabel: "18 hours ago",
    createdAt: "2026-03-22T14:50:00.000Z",
  },
  {
    id: "listing-kettle-fast-boil",
    title: "Fast-Boil Electric Kettle with Auto Shut-Off",
    description:
      "Reliable kettle for noodles, tea, or quick breakfasts between classes.",
    price: 260000,
    categoryId: "home-appliances",
    condition: "New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Electric kettle",
    imagePosition: "center 18%",
    imageOverlayClassName:
      "bg-gradient-to-t from-amber-950/55 via-amber-950/10 to-transparent",
    seller: {
      name: "Tam Phan",
      initials: "TP",
      avatarClassName: "bg-amber-100 text-amber-700",
    },
    listedAtLabel: "20 hours ago",
    createdAt: "2026-03-22T12:35:00.000Z",
  },
  {
    id: "listing-desk-organizer-bundle",
    title: "Desk Organizer Bundle with Pen Holder and Tray",
    description:
      "Simple neutral setup that keeps study tables tidy in smaller rooms.",
    price: 150000,
    categoryId: "dorm-essentials",
    condition: "New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Desk organizer set",
    imagePosition: "center 38%",
    imageOverlayClassName:
      "bg-gradient-to-t from-emerald-950/55 via-emerald-950/10 to-transparent",
    seller: {
      name: "Quynh Mai",
      initials: "QM",
      avatarClassName: "bg-emerald-100 text-emerald-700",
    },
    listedAtLabel: "1 day ago",
    createdAt: "2026-03-22T10:15:00.000Z",
  },
  {
    id: "listing-bike-lock",
    title: "Heavy-Duty Bike Lock for Daily Campus Parking",
    description:
      "Secure cable lock that is easy to carry in a backpack or basket.",
    price: 210000,
    categoryId: "others",
    condition: "Like New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Bike lock on a campus rack",
    imagePosition: "center 52%",
    imageOverlayClassName:
      "bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent",
    seller: {
      name: "Hoang Vu",
      initials: "HV",
      avatarClassName: "bg-slate-200 text-slate-700",
    },
    listedAtLabel: "1 day ago",
    createdAt: "2026-03-22T08:40:00.000Z",
  },
  {
    id: "listing-portable-whiteboard",
    title: "Portable Whiteboard for Group Study Sessions",
    description:
      "Lightweight board for brainstorming, tutoring, or room schedules.",
    price: 340000,
    categoryId: "others",
    condition: "Used",
    imageSrc: "/images/download.jpg",
    imageAlt: "Portable whiteboard for studying",
    imagePosition: "center 44%",
    imageOverlayClassName:
      "bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent",
    seller: {
      name: "Nam Ngo",
      initials: "NN",
      avatarClassName: "bg-slate-200 text-slate-700",
    },
    listedAtLabel: "1 day ago",
    createdAt: "2026-03-22T07:10:00.000Z",
  },
  {
    id: "listing-macroeconomics-textbook",
    title: "Macroeconomics Textbook plus Lecture Summary Sheets",
    description:
      "Includes clean lecture summaries and review questions for midterms.",
    price: 290000,
    categoryId: "textbooks-study-materials",
    condition: "Used",
    imageSrc: "/images/download.jpg",
    imageAlt: "Macroeconomics textbook",
    imagePosition: "center 24%",
    imageOverlayClassName:
      "bg-gradient-to-t from-blue-950/55 via-blue-950/10 to-transparent",
    seller: {
      name: "Hanh Ly",
      initials: "HL",
      avatarClassName: "bg-blue-100 text-blue-700",
    },
    listedAtLabel: "2 days ago",
    createdAt: "2026-03-21T15:40:00.000Z",
  },
  {
    id: "listing-second-monitor",
    title: "24-inch Second Monitor for Coding and Design Work",
    description:
      "Sharp display with HDMI cable included, ideal for productive setups.",
    price: 2400000,
    categoryId: "electronics",
    condition: "Like New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Second monitor on a study desk",
    imagePosition: "center 48%",
    imageOverlayClassName:
      "bg-gradient-to-t from-violet-950/60 via-violet-950/15 to-transparent",
    seller: {
      name: "Duc Bui",
      initials: "DB",
      avatarClassName: "bg-violet-100 text-violet-700",
    },
    listedAtLabel: "2 days ago",
    createdAt: "2026-03-21T13:20:00.000Z",
  },
  {
    id: "listing-bedding-set",
    title: "Neutral Bedding Set for Single Dorm Bed",
    description:
      "Soft sheets, pillowcase, and lightweight blanket for semester move-in.",
    price: 560000,
    categoryId: "dorm-essentials",
    condition: "New",
    imageSrc: "/images/download.jpg",
    imageAlt: "Dorm bedding set",
    imagePosition: "center 56%",
    imageOverlayClassName:
      "bg-gradient-to-t from-emerald-950/55 via-emerald-950/10 to-transparent",
    seller: {
      name: "Yen Tran",
      initials: "YT",
      avatarClassName: "bg-emerald-100 text-emerald-700",
    },
    listedAtLabel: "2 days ago",
    createdAt: "2026-03-21T11:05:00.000Z",
  },
];
