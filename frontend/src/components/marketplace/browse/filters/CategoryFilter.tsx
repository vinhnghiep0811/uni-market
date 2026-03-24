import type { MarketplaceCategory } from "../types";

type CategoryFilterProps = {
  categories: MarketplaceCategory[];
  selectedCategoryIds: string[];
  onToggleCategory: (categoryId: string) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategoryIds,
  onToggleCategory,
}: CategoryFilterProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">Categories</h2>
        <p className="mt-1 text-sm text-slate-500">
          Narrow down listings by item type.
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id);

          return (
            <label
              key={category.id}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3.5 py-3 transition duration-200 ${
                isSelected
                  ? "border-slate-900 bg-slate-50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleCategory(category.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />

              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-900">
                  {category.name}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {category.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
