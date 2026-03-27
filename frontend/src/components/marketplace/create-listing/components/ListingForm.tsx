import { AlertCircle, LoaderCircle, SendHorizonal } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { cn } from "@/components/ui/cn";

import CategorySelect from "./CategorySelect";
import ConditionSelect from "./ConditionSelect";
import ContactNoteField from "./ContactNoteField";
import FormField from "./FormField";
import LocationField from "./LocationField";
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
} from "../constants";
import { formatPricePreview } from "../utils";
import type {
  FeedbackTone,
  ListingCategory,
  ListingFormErrors,
  ListingFormValues,
} from "../types";

type ListingFormProps = {
  values: ListingFormValues;
  errors: ListingFormErrors;
  categories: ListingCategory[];
  isLoadingCategories: boolean;
  categoryLoadError: string | null;
  isSubmitting?: boolean;
  isPublishDisabled?: boolean;
  feedbackMessage?: string | null;
  feedbackTone?: FeedbackTone;
  onRetryCategories: () => void;
  onPublish?: () => void;
  onFieldChange: <FieldName extends keyof ListingFormValues>(
    field: FieldName,
    value: ListingFormValues[FieldName],
  ) => void;
};

const feedbackToneClasses: Record<FeedbackTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-slate-200 bg-slate-50 text-slate-600",
};

export default function ListingForm({
  values,
  errors,
  categories,
  isLoadingCategories,
  categoryLoadError,
  isSubmitting = false,
  isPublishDisabled,
  feedbackMessage = null,
  feedbackTone = "info",
  onRetryCategories,
  onPublish,
  onFieldChange,
}: ListingFormProps) {
  return (
    <Card className="overflow-hidden  border border-slate-200">
      <div className="space-y-8 p-6">
        <section className="space-y-5">
          <div className="space-y-5">
            <FormField
              label="Title"
              htmlFor="title"
              required
              error={errors.title}
              errorId="title-error"
              helperText={`Use ${TITLE_MIN_LENGTH} to ${TITLE_MAX_LENGTH} characters and include the item name, brand, or edition.`}
              helperId="title-helper"
              counter={`${values.title.length}/${TITLE_MAX_LENGTH}`}
            >
              <Input
                id="title"
                value={values.title}
                maxLength={TITLE_MAX_LENGTH}
                placeholder="Organic Chemistry Textbook 4th Edition"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : "title-helper"}
                className={cn(
                  "focus:border-blue-300 focus:ring-blue-50",
                  errors.title &&
                    "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-rose-100",
                )}
                onChange={(event) => onFieldChange("title", event.target.value)}
              />
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              required
              error={errors.description}
              errorId="description-error"
              helperText={`Write at least ${DESCRIPTION_MIN_LENGTH} characters so buyers know the condition, included accessories, and anything important before they message you.`}
              helperId="description-helper"
              counter={`${values.description.length}/${DESCRIPTION_MAX_LENGTH}`}
            >
              <Textarea
                id="description"
                rows={7}
                value={values.description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                placeholder="Describe the item's condition, included accessories, and any important details for buyers."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description
                    ? "description-error"
                    : "description-helper"
                }
                className={cn(
                  "min-h-[168px] resize-y focus:border-blue-300 focus:ring-blue-50",
                  errors.description &&
                    "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-rose-100",
                )}
                onChange={(event) =>
                  onFieldChange("description", event.target.value)
                }
              />
            </FormField>
          </div>
        </section>

        <section className="space-y-5">
          {categoryLoadError ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{categoryLoadError}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="rounded-2xl border border-amber-200 bg-white text-amber-900 hover:bg-amber-100"
                onClick={onRetryCategories}
              >
                Retry
              </Button>
            </div>
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
            <div className="space-y-5 min-w-0">
              <FormField
                label="Price"
                htmlFor="price"
                required
                error={errors.price}
                errorId="price-error"
                helperText={
                  formatPricePreview(values.price)
                    ? `Approx. ${formatPricePreview(values.price)}`
                    : "Enter the asking price as digits only."
                }
                helperId="price-helper"
              >
                <div className="relative">
                  <Input
                    id="price"
                    value={values.price}
                    inputMode="numeric"
                    placeholder="150000"
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={errors.price ? "price-error" : "price-helper"}
                    className={cn(
                      "pr-16 focus:border-blue-300 focus:ring-blue-50",
                      errors.price &&
                        "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-rose-100",
                    )}
                    onChange={(event) =>
                      onFieldChange("price", event.target.value.replace(/[^\d]/g, ""))
                    }
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    VND
                  </span>
                </div>
              </FormField>

              <ConditionSelect
                value={values.condition}
                error={errors.condition}
                onChange={(value) => onFieldChange("condition", value)}
              />
            </div>

            <CategorySelect
              value={values.categoryId}
              categories={categories}
              disabled={isLoadingCategories}
              error={errors.categoryId}
              onChange={(value) => onFieldChange("categoryId", value)}
            />
          </div>

          {isLoadingCategories ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading categories...
            </div>
          ) : null}
        </section>

        <section className="space-y-5">
          <div className="space-y-5">
            <LocationField
              value={values.location}
              error={errors.location}
              onChange={(value) => onFieldChange("location", value)}
            />
            <ContactNoteField
              value={values.contactNote}
              error={errors.contactNote}
              onChange={(value) => onFieldChange("contactNote", value)}
            />
          </div>
        </section>

        {onPublish ? (
          <section className="space-y-4 border-t border-slate-200 pt-6">
            {feedbackMessage ? (
              <div
                className={`inline-flex min-h-10 items-center rounded-2xl border px-3 py-2 text-sm ${feedbackToneClasses[feedbackTone]}`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            <Button
              type="button"
              size="lg"
              disabled={isSubmitting || isPublishDisabled}
              className="w-full rounded-2xl bg-blue-950 px-5 text-white hover:bg-blue-900 disabled:bg-slate-300"
              leadingIcon={
                isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizonal className="h-4 w-4" />
                )
              }
              onClick={onPublish}
            >
              Publish Listing
            </Button>
          </section>
        ) : null}
      </div>
    </Card>
  );
}
