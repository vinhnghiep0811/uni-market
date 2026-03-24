import Textarea from "@/components/ui/Textarea";
import { cn } from "@/components/ui/cn";

import { CONTACT_NOTE_MAX_LENGTH } from "../constants";
import FormField from "./FormField";

type ContactNoteFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function ContactNoteField({
  value,
  error,
  onChange,
}: ContactNoteFieldProps) {
  return (
    <FormField
      label="Contact Note"
      htmlFor="contactNote"
      error={error}
      errorId="contactNote-error"
      helperText="Optional instructions like preferred hours, meetup days, or response expectations."
      helperId="contactNote-helper"
      counter={`${value.length}/${CONTACT_NOTE_MAX_LENGTH}`}
    >
      <Textarea
        id="contactNote"
        rows={4}
        value={value}
        maxLength={CONTACT_NOTE_MAX_LENGTH}
        placeholder="Please message before 6 PM or available for meetup on weekdays."
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "contactNote-error" : "contactNote-helper"}
        className={cn(
          "min-h-[112px] resize-none focus:border-blue-300 focus:ring-blue-50",
          error && "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-rose-100",
        )}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}

