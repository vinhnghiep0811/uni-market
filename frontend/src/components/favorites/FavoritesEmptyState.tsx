import { HeartOff, SearchX } from "lucide-react";
import Link from "next/link";

import Card from "@/components/ui/Card";

type FavoritesEmptyStateProps = {
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
};

export default function FavoritesEmptyState({
  hasActiveFilters = false,
  onResetFilters,
}: FavoritesEmptyStateProps) {
  const Icon = hasActiveFilters ? SearchX : HeartOff;

  return (
    <Card className="overflow-hidden rounded-[32px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-[0_24px_60px_-38px_rgba(15,23,42,0.24)] sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_55%,#f8fafc_100%)] text-blue-700 shadow-inner">
        <Icon className="h-9 w-9" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
        {hasActiveFilters ? "No items match these filters" : "No saved items yet"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
        {hasActiveFilters
          ? "Try widening your budget or switching categories to reveal more saved finds."
          : "Start exploring and save items you like."}
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Reset Filters
          </button>
        ) : null}

        <Link
          href="/#marketplace-listings"
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Browse Listings
        </Link>
      </div>
    </Card>
  );
}
