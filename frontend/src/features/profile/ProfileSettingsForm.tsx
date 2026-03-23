import { AlertCircle, Camera, CheckCircle2 } from "lucide-react";
import type { FormEvent } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import type { ProfileContactState, ProfileFormErrors } from "./types";

type ProfileSettingsFormProps = {
  values: ProfileContactState;
  errors: ProfileFormErrors;
  isSaving: boolean;
  feedbackMessage?: string | null;
  feedbackTone?: "success" | "error";
  onChange: (field: keyof ProfileContactState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ProfileSettingsForm({
  values,
  errors,
  isSaving,
  feedbackMessage,
  feedbackTone = "success",
  onChange,
  onSubmit,
}: ProfileSettingsFormProps) {
  return (
    <Card className="p-5">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Profile Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Keep your contact details up to date for campus buyers.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {feedbackMessage ? (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-2xl px-4 py-3 text-sm ${
              feedbackTone === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-start gap-3">
              {feedbackTone === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{feedbackMessage}</span>
            </div>
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <Input
            value={values.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            placeholder="Your full name"
            disabled={isSaving}
          />
          {errors.fullName ? (
            <p className="mt-2 text-xs text-red-600">{errors.fullName}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <Input
            value={values.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            placeholder="Add a phone number"
            disabled={isSaving}
          />
          {errors.phoneNumber ? (
            <p className="mt-2 text-xs text-red-600">{errors.phoneNumber}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Facebook Link
          </label>
          <Input
            value={values.facebookLink}
            onChange={(event) => onChange("facebookLink", event.target.value)}
            placeholder="https://facebook.com/..."
            disabled={isSaving}
          />
          {errors.facebookLink ? (
            <p className="mt-2 text-xs text-red-600">{errors.facebookLink}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Avatar URL
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={values.avatarUrl}
              onChange={(event) => onChange("avatarUrl", event.target.value)}
              placeholder="https://..."
              disabled={isSaving}
            />
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Camera className="h-4 w-4" />
            </span>
          </div>
          {errors.avatarUrl ? (
            <p className="mt-2 text-xs text-red-600">{errors.avatarUrl}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}
