import { SlidersHorizontal } from "lucide-react";

import { SORT_OPTIONS } from "../data";
import type { SortOption } from "../types";

type SectionHeaderProps = {
  resultCount: number;
  sortOption: SortOption;
  onChangeSort: (value: SortOption) => void;
};

export default function SectionHeader({
  resultCount,
  sortOption,
  onChangeSort,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Explore Items
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Over 1,200 items available in your campus
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:items-end">
        <span className="text-sm text-slate-500">
          {resultCount} matching listings
        </span>

        <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 shadow-sm">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-600">Sort by</span>
          <select
            value={sortOption}
            onChange={(event) => onChangeSort(event.target.value as SortOption)}
            className="bg-transparent font-medium text-slate-900 outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
