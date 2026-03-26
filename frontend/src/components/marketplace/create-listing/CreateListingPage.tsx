"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import {
  isSupportedImageFile,
  uploadListingImages,
} from "@/lib/uploads";

import ActionButtons from "./components/ActionButtons";
import {
  INITIAL_FORM_VALUES,
  MAX_IMAGES,
} from "./constants";
import ImageUploadPanel from "./components/ImageUploadPanel";
import ListingForm from "./components/ListingForm";
import PageHeader from "./components/PageHeader";
import {
  buildCreateListingPayload,
  validateListingForm,
} from "./utils";
import type {
  FeedbackTone,
  ListingCategory,
  ListingFormErrors,
  ListingFormValues,
  ListingImage,
  SubmissionAction,
} from "./types";

type CreatedListing = {
  id: string;
};

export default function CreateListingPage() {
  const [values, setValues] = useState<ListingFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<ListingFormErrors>({});
  const [categories, setCategories] = useState<ListingCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(null);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAction, setActiveAction] = useState<SubmissionAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>("info");

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryLoadError(null);

    try {
      const response = await apiRequest<ListingCategory[]>("/categories");
      setCategories(response);
    } catch (error) {
      setCategoryLoadError(
        error instanceof Error
          ? error.message
          : "Could not load categories right now.",
      );
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const updateField = <FieldName extends keyof ListingFormValues>(
    field: FieldName,
    value: ListingFormValues[FieldName],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
    setFeedbackMessage(null);
    setFeedbackTone("info");
  };

  const addImages = (files: File[]) => {
    setErrors((current) => ({ ...current, images: undefined, form: undefined }));
    setFeedbackMessage(null);
    setFeedbackTone("info");

    const supportedFiles = files.filter((file) => isSupportedImageFile(file));
    const unsupportedCount = files.length - supportedFiles.length;

    setImages((current) => {
      const remainingSlots = MAX_IMAGES - current.length;
      const nextMessages: string[] = [];

      if (remainingSlots <= 0) {
        setErrors((existing) => ({
          ...existing,
          images: `You can upload up to ${MAX_IMAGES} images.`,
        }));
        return current;
      }

      if (unsupportedCount > 0) {
        nextMessages.push("Only JPG, PNG, and WEBP images are supported.");
      }

      const acceptedFiles = supportedFiles.slice(0, remainingSlots);
      const nextImages = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      if (acceptedFiles.length < supportedFiles.length) {
        nextMessages.push(`Only the first ${MAX_IMAGES} images are kept.`);
      }

      if (nextMessages.length > 0) {
        setErrors((existing) => ({
          ...existing,
          images: nextMessages.join(" "),
        }));
      }

      return [...current, ...nextImages];
    });
  };

  const removeImage = (imageId: string) => {
    setImages((current) => {
      const imageToRemove = current.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return current.filter((image) => image.id !== imageId);
    });

    setErrors((current) => ({ ...current, images: undefined }));
  };

  const moveImage = (imageId: string, direction: "left" | "right") => {
    setImages((current) => {
      const currentIndex = current.findIndex((image) => image.id === imageId);

      if (currentIndex === -1) {
        return current;
      }

      const targetIndex =
        direction === "left" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const reordered = [...current];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, moved);

      return reordered;
    });
  };

  const resetForm = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setValues(INITIAL_FORM_VALUES);
    setErrors({});
    setImages([]);
  };

  const submitListing = async (action: Exclude<SubmissionAction, null>) => {
    const nextErrors = validateListingForm(values, images.length);

    if (categoryLoadError || categories.length === 0) {
      nextErrors.form = "Categories need to load before you can create a listing.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFeedbackMessage(
        nextErrors.form ?? "Please fix the highlighted fields and try again.",
      );
      setFeedbackTone("error");
      return;
    }

    setIsSubmitting(true);
    setActiveAction(action);
    setFeedbackMessage(null);
    setFeedbackTone("info");

    try {
      const imageUrls = await uploadListingImages(
        images.map((image) => image.file),
      );

      const createdListing = await apiRequest<CreatedListing>("/listings", {
        method: "POST",
        body: buildCreateListingPayload(values, imageUrls),
      });

      if (action === "publish") {
        await apiRequest(`/listings/${createdListing.id}/status`, {
          method: "PATCH",
          body: { status: "PUBLISHED" },
        });
      }

      resetForm();
      setFeedbackMessage(
        action === "publish"
          ? "Listing published successfully. Buyers can now find it in Uni Market."
          : "Draft saved successfully. It stays private until you publish it.",
      );
      setFeedbackTone("success");
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the listing.",
      );
      setFeedbackTone("error");
    } finally {
      setIsSubmitting(false);
      setActiveAction(null);
    }
  };

  return (
    <section className="min-h-[calc(100vh-73px)] bg-[radial-gradient(circle_at_top_left,rgba(30,64,175,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
          <ImageUploadPanel
            images={images}
            error={errors.images}
            onAddImages={addImages}
            onRemoveImage={removeImage}
            onMoveImage={moveImage}
          />

          <ListingForm
            values={values}
            errors={errors}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            categoryLoadError={categoryLoadError}
            onRetryCategories={() => {
              void loadCategories();
            }}
            onFieldChange={updateField}
          />
        </div>

        <ActionButtons
          isSubmitting={isSubmitting}
          activeAction={activeAction}
          isDisabled={isLoadingCategories || categories.length === 0}
          feedbackMessage={feedbackMessage}
          feedbackTone={feedbackTone}
          onSaveDraft={() => {
            void submitListing("draft");
          }}
          onPublish={() => {
            void submitListing("publish");
          }}
        />
      </div>
    </section>
  );
}

