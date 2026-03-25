/* eslint-disable @next/next/no-img-element */
"use client";

import { ExternalLink, Facebook, Phone, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";

import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";
import { useAuth } from "@/context/AuthContext";

import type { ListingDetailViewModel } from "./types";

type ListingSellerPanelProps = {
  listing: ListingDetailViewModel;
};

const actionButtonClassName =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-200";

export default function ListingSellerPanel({
  listing,
}: ListingSellerPanelProps) {
  const { user } = useAuth();
  const canViewProfile = user?.id === listing.seller.id;

  return (
    <div className="space-y-5">
      <Card className="p-6 sm:p-7" id="seller-card">
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Seller</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review contact details before you message or meet up.
            </p>
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

            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-slate-950">
                {listing.seller.fullName}
              </p>

              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {listing.seller.phoneNumber ? (
                  <a
                    href={`tel:${listing.seller.phoneNumber}`}
                    className="flex items-center gap-2 transition hover:text-slate-900"
                  >
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{listing.seller.phoneNumber}</span>
                  </a>
                ) : null}

                {listing.seller.facebookLink ? (
                  <a
                    href={listing.seller.facebookLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition hover:text-slate-900"
                  >
                    <Facebook className="h-4 w-4 text-slate-400" />
                    <span>Facebook profile available</span>
                  </a>
                ) : null}

                {!listing.seller.phoneNumber && !listing.seller.facebookLink ? (
                  <p className="text-slate-500">
                    Seller will share preferred contact details during chat.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {listing.seller.facebookLink ? (
              <a
                href={listing.seller.facebookLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  actionButtonClassName,
                  "bg-blue-600 text-white hover:bg-blue-700",
                )}
              >
                <Facebook className="h-4 w-4" />
                Facebook
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className={cn(
                  actionButtonClassName,
                  "bg-slate-100 text-slate-400",
                )}
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </button>
            )}

            {canViewProfile ? (
              <Link
                href="/profile"
                className={cn(
                  actionButtonClassName,
                  "bg-slate-100 text-slate-800 hover:bg-slate-200",
                )}
              >
                <UserRound className="h-4 w-4" />
                View Profile
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className={cn(
                  actionButtonClassName,
                  "bg-slate-100 text-slate-400",
                )}
              >
                <UserRound className="h-4 w-4" />
                View Profile
              </button>
            )}
          </div>
        </div>
      </Card>

      {listing.contactNote ? (
        <Card className="border border-blue-100 bg-blue-50/80 p-6 sm:p-7">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">
              Contact Note
            </p>
            <p className="text-sm leading-7 text-blue-950 sm:text-[15px]">
              {listing.contactNote}
            </p>
          </div>
        </Card>
      ) : null}

      <Card className="p-6 sm:p-7">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Safety Notice</h2>
              <p className="text-sm text-slate-500">
                Keep every exchange simple and safe on campus.
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            <li className="rounded-[18px] bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              Meet in public campus areas.
            </li>
            <li className="rounded-[18px] bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              Avoid transferring money before meeting.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

