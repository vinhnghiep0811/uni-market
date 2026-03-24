import { ChevronDown } from "lucide-react";

import { cn } from "@/components/ui/cn";

import { CONDITION_OPTIONS } from "../constants";
import FormField from "./FormField";
import type { ListingConditionValue } from "../types";

type ConditionSelectProps = {
  value: ListingConditionValue | "";
  error?: string;
  onChange: (value: ListingConditionValue | "") => void;
};

export default function ConditionSelect({
  value,
  error,
  onChange,
}: ConditionSelectProps) {
  const selectedOption = CONDITION_OPTIONS.find((option) => option.value === value);

  return (
    <FormField
      label="Condition"
      htmlFor="condition"
      required
      error={error}
      errorId="condition-error"
      helperText={
        selectedOption?.description ??
        "Choose the condition that best matches how the item will feel to a buyer."
      }
      helperId="condition-helper"
    >
      <div className="relative">
        <select
          id="condition"
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "condition-error" : "condition-helper"}
          className={cn(
            "h-11 w-full appearance-none rounded-2xl border bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition duration-200",
            "border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-50",
            error && "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-rose-100",
          )}
          onChange={(event) =>
            onChange(event.target.value as ListingConditionValue | "")
          }
        >
          <option value="">Select condition</option>
          {CONDITION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </FormField>
  );
}

