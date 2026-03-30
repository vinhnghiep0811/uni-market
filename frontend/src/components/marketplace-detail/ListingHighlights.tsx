"use client";

import { useState } from "react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";
import type { TransactionStatus } from "@/lib/transactions";

import type { ListingDetailViewModel } from "./types";
import {
  formatVndPrice,
  shouldAllowDescriptionExpand,
} from "./utils";

type ListingHighlightsProps = {
  listing: ListingDetailViewModel;
  purchaseStatus: TransactionStatus | null;
  isPurchasePending: boolean;
  purchaseFeedback: string | null;
  purchaseFeedbackTone: "success" | "error";
  isOwnedByCurrentUser: boolean;
  onPurchase: () => Promise<void>;
};

function getPurchasePresentation(options: {
  isOwnedByCurrentUser: boolean;
  purchaseStatus: TransactionStatus | null;
  isPurchasePending: boolean;
}) {
  if (options.isOwnedByCurrentUser) {
    return {
      buttonLabel: "Your listing",
      helperText: "You cannot create an order for your own listing.",
      disabled: true,
    };
  }

  if (options.purchaseStatus === "PENDING") {
    return {
      buttonLabel: "Request sent",
      helperText: "You already created a purchase request for this item.",
      disabled: true,
    };
  }

  if (options.purchaseStatus === "ACCEPTED") {
    return {
      buttonLabel: "In progress",
      helperText: "The seller accepted your request. Continue in your profile.",
      disabled: true,
    };
  }

  return {
    buttonLabel: options.isPurchasePending ? "Sending..." : "Place Order",
    helperText: "Create an order and wait for the seller to respond.",
    disabled: options.isPurchasePending,
  };
}

export default function ListingHighlights({
  listing,
  purchaseStatus,
  isPurchasePending,
  purchaseFeedback,
  purchaseFeedbackTone,
  isOwnedByCurrentUser,
  onPurchase,
}: ListingHighlightsProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const metadataItems = [
    {
      key: "condition",
      label: "Condition",
      value: listing.conditionLabel,
    },
    {
      key: "posted",
      label: "Posted Time",
      value: listing.postedTimeLabel,
    },
    {
      key: "location",
      label: "Location",
      value: listing.location ?? "Campus meetup preferred",
    },
  ] as const;

  const shouldShowExpandButton = shouldAllowDescriptionExpand(listing.description);
  const purchasePresentation = getPurchasePresentation({
    isOwnedByCurrentUser,
    purchaseStatus,
    isPurchasePending,
  });

  return (
    <div className="space-y-0">
      <Card className="px-8 py-4">
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4">
              <Badge className="bg-blue-50 text-blue-700">
                {listing.categoryName}
              </Badge>
              <h1 className="line-clamp-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-end gap-3">
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
            </div>
          </div>

          <div className="overflow-hidden rounded-[15px] border border-slate-200">
            <div className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {metadataItems.map((item) => {
                return (
                  <div
                    key={item.key}
                    className="bg-slate-50 px-4 py-5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card className="sm:px-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Description</h2>
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

      <Card className="overflow-hidden px-8 py-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">
                Contact Note
              </p>
              <p className="text-sm leading-7 text-blue-950 sm:text-[15px]">
                {listing.contactNote?.trim() || "Seller did not add a contact note yet."}
              </p>
            </div>

            <div className="w-full shrink-0 lg:w-auto">
              <Button
                size="lg"
                disabled={purchasePresentation.disabled}
                className="w-full whitespace-nowrap lg:w-auto"
                onClick={() => {
                  void onPurchase();
                }}
              >
                {purchasePresentation.buttonLabel}
              </Button>
              {/* <p className="mt-2 text-sm text-slate-500">
                {purchasePresentation.helperText}
              </p> */}
            </div>
          </div>

          {purchaseFeedback ? (
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                purchaseFeedbackTone === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-rose-200 bg-rose-50 text-rose-700",
              )}
            >
              {purchaseFeedback}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
