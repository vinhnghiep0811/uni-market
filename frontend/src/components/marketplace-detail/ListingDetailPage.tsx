"use client";

import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import {
  isActiveTransactionStatus,
  type TransactionListResponse,
  type TransactionMutationResponse,
  type TransactionStatus,
} from "@/lib/transactions";

import ListingGallery from "./ListingGallery";
import ListingHighlights from "./ListingHighlights";
import ListingSafetyNotice from "./ListingSafetyNotice";
import ListingSellerPanel from "./ListingSellerPanel";
import type { ListingDetailApi, ListingDetailViewModel } from "./types";
import { mapListingDetail } from "./utils";

type ListingDetailPageProps = {
  listingId: string;
};

function ListingDetailLoadingState() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <Card className="overflow-hidden p-4">
        <div className="aspect-[5/4] animate-pulse rounded-[28px] bg-slate-200" />
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-[22px] bg-slate-200"
            />
          ))}
        </div>
      </Card>

      <div className="space-y-5">
        <Card className="space-y-4 p-7">
          <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-10 w-48 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-[22px] bg-slate-100"
              />
            ))}
          </div>
        </Card>

        <Card className="h-64 bg-slate-100 p-7" />
      </div>
    </div>
  );
}

export default function ListingDetailPage({
  listingId,
}: ListingDetailPageProps) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const [listing, setListing] = useState<ListingDetailViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState<TransactionStatus | null>(null);
  const [isPurchasePending, setIsPurchasePending] = useState(false);
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);
  const [purchaseFeedbackTone, setPurchaseFeedbackTone] = useState<
    "success" | "error"
  >("success");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadListing = async () => {
      setIsLoading(true);
      setLoadError(null);
      setPurchaseFeedback(null);
      setPurchaseStatus(null);

      try {
        const [response, myRequests] = await Promise.all([
          apiRequest<ListingDetailApi>(`/listings/${listingId}`),
          currentUserId
            ? apiRequest<TransactionListResponse>("/transactions/my-requests")
            : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        setListing(mapListingDetail(response));
        const activeRequest = myRequests?.data.find(
          (transaction) =>
            transaction.listingId === listingId &&
            isActiveTransactionStatus(transaction.status),
        );
        setPurchaseStatus(activeRequest?.status ?? null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setListing(null);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load this listing right now.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadListing();

    return () => {
      isMounted = false;
    };
  }, [currentUserId, listingId]);

  const handlePurchase = async () => {
    if (!listing || isPurchasePending) {
      return;
    }

    if (!currentUserId) {
      setPurchaseFeedback("Please log in to create a purchase request.");
      setPurchaseFeedbackTone("error");
      return;
    }

    if (listing.seller.id === currentUserId) {
      setPurchaseFeedback("You cannot create an order for your own listing.");
      setPurchaseFeedbackTone("error");
      return;
    }

    setPurchaseFeedback(null);
    setIsPurchasePending(true);

    try {
      const response = await apiRequest<TransactionMutationResponse>(
        "/transactions",
        {
          method: "POST",
          body: { listingId: listing.id },
        },
      );

      setPurchaseStatus(response.data?.status ?? "PENDING");
      setPurchaseFeedback("Purchase request sent. Track it in your profile.");
      setPurchaseFeedbackTone("success");
    } catch (error) {
      setPurchaseFeedback(
        error instanceof Error ? error.message : "Could not create request.",
      );
      setPurchaseFeedbackTone("error");
    } finally {
      setIsPurchasePending(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-73px)] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {isLoading ? <ListingDetailLoadingState /> : null}

        {!isLoading && loadError ? (
          <Card className="p-8 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-950">
                  Could not load this listing
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {loadError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <RefreshCcw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </Card>
        ) : null}

        {!isLoading && listing ? (
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="space-y-5">
                <ListingGallery images={listing.images} title={listing.title} />
                <ListingSafetyNotice />
              </div>

              <div className="space-y-2 py-4">
                <div className="flex flex-wrap items-center gap-2 px-8 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <Link href="/" className="transition hover:text-slate-900">
                    Home
                  </Link>
                  <span>&gt;</span>
                  <Link
                    href="/#marketplace-listings"
                    className="transition hover:text-slate-900"
                  >
                    {listing.categoryName}
                  </Link>
                  <span>&gt;</span>
                  <span className="max-w-full truncate text-slate-500">
                    {listing.title}
                  </span>
                </div>
                <ListingHighlights
                  listing={listing}
                  purchaseStatus={purchaseStatus}
                  isPurchasePending={isPurchasePending}
                  purchaseFeedback={purchaseFeedback}
                  purchaseFeedbackTone={purchaseFeedbackTone}
                  isOwnedByCurrentUser={listing.seller.id === currentUserId}
                  onPurchase={handlePurchase}
                />
                <ListingSellerPanel listing={listing} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
