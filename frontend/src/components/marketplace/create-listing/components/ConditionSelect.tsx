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
  const fieldId = value ? `condition-${value}` : "condition-NEW";

  return (
    <FormField
      label="Condition"
      htmlFor={fieldId}
      required
      error={error}
      errorId="condition-error"
      helperText={
        selectedOption?.description ??
        "Choose the condition that best matches how the item will feel to a buyer."
      }
      helperId="condition-helper"
    >
      <div className="flex flex-wrap gap-2">
        {CONDITION_OPTIONS.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              id={`condition-${option.value}`}
              type="button"
              aria-pressed={isActive}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition duration-200",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
                error && !isActive && "ring-1 ring-rose-200",
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}
