/* eslint-disable @next/next/no-img-element */
"use client";

import { ExternalLink, Facebook, Phone } from "lucide-react";

import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";

import type { ListingDetailViewModel } from "./types";

type ListingSellerPanelProps = {
  listing: ListingDetailViewModel;
};

const actionButtonClassName =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-200";

export default function ListingSellerPanel({
  listing,
}: ListingSellerPanelProps) {
  return (
    <Card className="px-8" id="seller-card">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Seller</h2>
        </div>

        <div className="flex items-start gap-4 rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-200">
          {listing.seller.avatarUrl ? (
            <img
              src={listing.seller.avatarUrl}
              alt={listing.seller.fullName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
              {listing.seller.initials}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="text-lg font-semibold text-slate-950">
                {listing.seller.fullName}
              </p>
              {listing.seller.phoneNumber ? (
                <a
                  href={`tel:${listing.seller.phoneNumber}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
                >
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{listing.seller.phoneNumber}</span>
                </a>
              ) : null}
            </div>

            {listing.seller.facebookLink ? (
              <a
                href={listing.seller.facebookLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  actionButtonClassName,
                  "w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto",
                )}
              >
                <Facebook className="h-4 w-4" />
                Facebook
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}

            {!listing.seller.phoneNumber && !listing.seller.facebookLink ? (
              <p className="text-sm text-slate-500">
                Seller will share preferred contact details during chat.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
