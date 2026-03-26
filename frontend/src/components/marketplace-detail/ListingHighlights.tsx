"use client";

import { Clock3, FolderOpen, Heart, MapPin, PackageCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";

import type { ListingDetailViewModel } from "./types";
import {
  formatVndPrice,
  shouldAllowDescriptionExpand,
} from "./utils";

type ListingHighlightsProps = {
  listing: ListingDetailViewModel;
  isFavoritePending: boolean;
  onToggleFavorite: () => Promise<void>;
};

const metadataIcons = {
  condition: Sparkles,
  posted: Clock3,
  location: MapPin,
  category: FolderOpen,
  status: PackageCheck,
} as const;

export default function ListingHighlights({
  listing,
  isFavoritePending,
  onToggleFavorite,
}: ListingHighlightsProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const metadataItems = [
    {
      key: "condition",
      label: "Condition",
      value: listing.conditionLabel,
      supporting: listing.conditionValue,
    },
    {
      key: "posted",
      label: "Posted Time",
      value: listing.postedTimeLabel,
      supporting: "Latest campus activity",
    },
    {
      key: "location",
      label: "Location",
      value: listing.location ?? "Campus meetup preferred",
      supporting: listing.location
        ? "Pickup arranged with seller"
        : "Seller will confirm a meetup spot",
    },
    {
      key: "category",
      label: "Category",
      value: listing.categoryName,
      supporting: "Uni Market category",
    },
    {
      key: "status",
      label: "Status",
      value: listing.statusLabel,
      supporting: `${listing.availabilityLabel} right now`,
    },
  ] as const;

  const shouldShowExpandButton = shouldAllowDescriptionExpand(listing.description);

  return (
    <div className="space-y-5">
      <Card className="p-6 sm:p-7">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge className="bg-blue-50 text-blue-700">
                Student marketplace listing
              </Badge>
              <h1 className="line-clamp-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {listing.title}
              </h1>
            </div>

            <button
              type="button"
              aria-label={listing.isFavorited ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={listing.isFavorited}
              title={listing.isFavorited ? "Remove from favorites" : "Add to favorites"}
              disabled={isFavoritePending}
              onClick={() => {
                void onToggleFavorite();
              }}
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-lg backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-70 ${listing.isFavorited ? "bg-white text-rose-500 ring-1 ring-rose-200/80 hover:bg-rose-50" : "bg-slate-950/55 text-white hover:bg-slate-950/70"}`}
            >
              <Heart
                className={`h-5 w-5 transition ${listing.isFavorited ? "fill-current" : "fill-transparent"}`}
              />
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 pb-6">
            <span className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {formatVndPrice(listing.price)}
            </span>

            {listing.originalPrice ? (
              <span className="pb-1 text-base text-slate-400 line-through">
                {formatVndPrice(listing.originalPrice)}
              </span>
            ) : null}

            {listing.discountPercentage ? (
              <Badge className="bg-emerald-50 text-emerald-700">
                -{listing.discountPercentage}%
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {metadataItems.map((item) => {
              const Icon = metadataIcons[item.key];

              return (
                <div
                  key={item.key}
                  className="rounded-[22px] bg-slate-50 p-4 ring-1 ring-slate-200/80"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-2xl bg-white p-2.5 text-slate-600 shadow-sm ring-1 ring-slate-200">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.supporting}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Description</h2>
            <p className="mt-1 text-sm text-slate-500">
              Details the seller shared for this item.
            </p>
          </div>

          <div>
            <p
              className={cn(
                "whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px]",
                !isDescriptionExpanded && shouldShowExpandButton && "line-clamp-6",
              )}
            >
              {listing.description}
            </p>

            {shouldShowExpandButton ? (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded((current) => !current)}
                className="mt-3 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
              >
                {isDescriptionExpanded ? "Show less" : "Show more"}
              </button>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
