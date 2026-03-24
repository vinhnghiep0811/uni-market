import { ChevronDown } from "lucide-react";

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

  return (
    <FormField
      label="Category"
      htmlFor="categoryId"
      required
      error={error}
      errorId="categoryId-error"
      helperText={
        selectedCategory?.description ??
        "Choose the best fit for textbooks, electronics, dorm items, and other campus essentials."
      }
      helperId="categoryId-helper"
    >
      <div className="relative">
        <select
          id="categoryId"
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "categoryId-error" : "categoryId-helper"}
          className={cn(
            "h-11 w-full appearance-none rounded-2xl border bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition duration-200",
            "border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-50",
            disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
            error && "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-rose-100",
          )}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </FormField>
  );
}

