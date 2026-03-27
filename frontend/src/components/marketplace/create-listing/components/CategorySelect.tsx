import { cn } from "@/components/ui/cn";

import FormField from "./FormField";
import type { ListingCategory } from "../types";

type CategorySelectProps = {
  value: string;
  categories: ListingCategory[];
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export default function CategorySelect({
  value,
  categories,
  disabled,
  error,
  onChange,
}: CategorySelectProps) {
  const selectedCategory = categories.find((category) => category.id === value);
  const fieldId = selectedCategory?.id
    ? `category-${selectedCategory.id}`
    : categories[0]
      ? `category-${categories[0].id}`
      : "category-empty";

  return (
    <FormField
      label="Categories"
      htmlFor={fieldId}
      required
      error={error}
      errorId="categoryId-error"
      helperText={
        selectedCategory?.description ??
        "Choose the best fit for textbooks, electronics, dorm items, and other campus essentials."
      }
      helperId="categoryId-helper"
    >
      <div
        className={cn(
          "space-y-2 min-w-0",
          disabled && "opacity-70",
          error && "border-rose-300 bg-rose-50/60",
        )}
      >
        {categories.map((category) => {
          const isSelected = value === category.id;

          return (
            <label
              key={category.id}
              htmlFor={`category-${category.id}`}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl py-3 transition duration-200",
                isSelected
                  ? "bg-white"
                  : "hover:bg-white/80",
                disabled && "cursor-not-allowed",
              )}
            >
              <input
                id={`category-${category.id}`}
                type="radio"
                name="categoryId"
                value={category.id}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(category.id)}
                className="mt-0.5 h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-400"
              />

              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-900">
                  {category.name}
                </span>
                {/* {category.description ? (
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {category.description}
                  </span>
                ) : null} */}
              </span>
            </label>
          );
        })}
      </div>
    </FormField>
  );
}
