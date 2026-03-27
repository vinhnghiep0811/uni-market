import { ChevronDown, SlidersHorizontal } from "lucide-react";

import Card from "@/components/ui/Card";

import type { FavoriteSortOption } from "./types";

type FavoritesHeaderProps = {
  resultCount: number;
  sortOption: FavoriteSortOption;
  onChangeSort: (value: FavoriteSortOption) => void;
  onToggleFilters: () => void;
};

export default function FavoritesHeader({
  resultCount,
  sortOption,
  onChangeSort,
  onToggleFilters,
}: FavoritesHeaderProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Saved Listings
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Items you&apos;ve saved for later on Uni Market.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <span className="sr-only">Sort saved items</span>
            <select
              value={sortOption}
              onChange={(event) =>
                onChangeSort(event.target.value as FavoriteSortOption)
              }
              className="h-11 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option>Recently Saved</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>

          {/* <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-700" />
            Filter
          </button> */}
        </div>
      </div>
    </Card>
  );
}
