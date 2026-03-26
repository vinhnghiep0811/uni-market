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
    <Card className="overflow-hidden border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Uni Market</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Saved Items
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Items you&apos;ve saved for later on Uni Market.
          </p>
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

          <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-700" />
            Filter
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
          {resultCount}
        </span>
        <span>saved items ready for your next campus pickup.</span>
      </div>
    </Card>
  );
}
