"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GripHorizontal,
  ImagePlus,
  Upload,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";
import { IMAGE_UPLOAD_ACCEPT } from "@/lib/uploads";

import { MAX_IMAGES } from "../constants";
import type { ListingImage } from "../types";

type ImageUploadPanelProps = {
  images: ListingImage[];
  error?: string;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (imageId: string) => void;
  onMoveImage: (imageId: string, direction: "left" | "right") => void;
};

export default function ImageUploadPanel({
  images,
  error,
  onAddImages,
  onRemoveImage,
  onMoveImage,
}: ImageUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const nextFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (nextFiles.length > 0) {
      onAddImages(nextFiles);
    }
  };

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white/95 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.4)]">
      <div className="border-b border-slate-200 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 px-6 py-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-100">Product images</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Help buyers trust what you&apos;re selling
            </h2>
            <p className="max-w-lg text-sm leading-6 text-slate-200">
              Upload up to 10 images. The first image becomes the cover buyers
              see first in the marketplace.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-blue-50 sm:block">
            {images.length}/{MAX_IMAGES} images
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <button
          type="button"
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-[28px] border border-dashed px-6 py-10 text-center transition duration-200",
            "border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/60",
            isDragActive && "border-blue-400 bg-blue-50",
            error && "border-rose-300 bg-rose-50/60",
          )}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
              return;
            }
            setIsDragActive(false);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragActive(false);
            handleFiles(event.dataTransfer.files);
          }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-950 shadow-sm ring-1 ring-slate-200">
            <Upload className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-900">
            Drag and drop images here
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            JPG, PNG, or WEBP work well for textbooks, electronics, calculators,
            and other campus essentials.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-950 px-4 py-2 text-sm font-medium text-white">
            <ImagePlus className="h-4 w-4" />
            Choose files
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_UPLOAD_ACCEPT}
          multiple
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Photo checklist
            </p>
            <p className="text-xs leading-5 text-slate-500">
              Use a bright cover shot, add detail angles, and keep the background
              simple.
            </p>
          </div>
          <div className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            First image = cover image
          </div>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        {images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 shadow-sm",
                  index === 0 && "sm:col-span-2",
                  index === 0 ? "h-52 sm:h-72" : "h-52",
                )}
              >
                <Image
                  src={image.previewUrl}
                  alt={image.file.name}
                  fill
                  unoptimized
                  className="object-cover"
                />

                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
                      index === 0
                        ? "bg-blue-950 text-white"
                        : "bg-white/90 text-slate-700",
                    )}
                  >
                    {index === 0 ? "Cover image" : `Image ${index + 1}`}
                  </span>
                  <span className="rounded-full bg-slate-950/65 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {Math.round(image.file.size / 1024)} KB
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-4 text-white">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{image.file.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-200">
                      <GripHorizontal className="h-3.5 w-3.5" />
                      Reorder to control the cover image
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Move ${image.file.name} left`}
                      disabled={index === 0}
                      className="rounded-full bg-white/15 p-2 transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => onMoveImage(image.id, "left")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${image.file.name} right`}
                      disabled={index === images.length - 1}
                      className="rounded-full bg-white/15 p-2 transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => onMoveImage(image.id, "right")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${image.file.name}`}
                      className="rounded-full bg-rose-500/85 p-2 text-white transition hover:bg-rose-500"
                      onClick={() => onRemoveImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-500 shadow-sm">
            No images added yet. A bright, front-facing photo is usually the best
            cover image for second-hand campus listings.
          </div>
        )}

        {images.length > 0 && images.length < MAX_IMAGES ? (
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50"
            leadingIcon={<ImagePlus className="h-4 w-4" />}
            onClick={() => inputRef.current?.click()}
          >
            Add more images
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

