import Input from "@/components/ui/Input";
import { cn } from "@/components/ui/cn";

import { LOCATION_MAX_LENGTH } from "../constants";
import FormField from "./FormField";

type LocationFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function LocationField({
  value,
  error,
  onChange,
}: LocationFieldProps) {
  return (
    <FormField
      label="Exchange Location"
      htmlFor="location"
      error={error}
      errorId="location-error"
      helperText="A campus landmark works best, like a library entrance, dorm lobby, or gate."
      helperId="location-helper"
      counter={`${value.length}/${LOCATION_MAX_LENGTH}`}
    >
      <Input
        id="location"
        value={value}
        maxLength={LOCATION_MAX_LENGTH}
        placeholder="Library entrance, Dorm A lobby, or Campus Gate 2"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "location-error" : "location-helper"}
        className={cn(
          "focus:border-blue-300 focus:ring-blue-50",
          error && "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-rose-100",
        )}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}

