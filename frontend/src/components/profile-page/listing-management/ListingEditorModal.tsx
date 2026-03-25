"use client";

import { X } from "lucide-react";

import ListingForm from "@/components/marketplace/create-listing/components/ListingForm";
import type {
  ListingCategory,
  ListingFormErrors,
  ListingFormValues,
} from "@/components/marketplace/create-listing/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type ListingEditorModalProps = {
  isOpen: boolean;
  listingTitle: string;
  values: ListingFormValues;
  errors: ListingFormErrors;
  categories: ListingCategory[];
  isLoadingCategories: boolean;
  categoryLoadError: string | null;
  feedbackMessage: string | null;
  feedbackTone: "success" | "error";
  isSaving: boolean;
  onRetryCategories: () => void;
  onChangeField: <FieldName extends keyof ListingFormValues>(
    field: FieldName,
    value: ListingFormValues[FieldName],
  ) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function ListingEditorModal({
  isOpen,
  listingTitle,
  values,
  errors,
  categories,
  isLoadingCategories,
  categoryLoadError,
  feedbackMessage,
  feedbackTone,
  isSaving,
  onRetryCategories,
  onChangeField,
  onClose,
  onSave,
}: ListingEditorModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm sm:px-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-start justify-between gap-4 rounded-[28px] bg-white px-6 py-5 shadow-2xl ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Edit listing
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {listingTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update the listing details shown to buyers. Images stay unchanged here.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            aria-label="Close listing editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <ListingForm
            values={values}
            errors={errors}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            categoryLoadError={categoryLoadError}
            onRetryCategories={onRetryCategories}
            onFieldChange={onChangeField}
          />

          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-6 text-sm">
                {feedbackMessage ? (
                  <p
                    className={
                      feedbackTone === "success"
                        ? "text-emerald-700"
                        : "text-rose-600"
                    }
                  >
                    {feedbackMessage}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={onSave}
                  disabled={
                    isSaving || isLoadingCategories || categories.length === 0
                  }
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
