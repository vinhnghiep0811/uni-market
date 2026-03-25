/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";

import type { ListingDetailImage } from "./types";

type ListingGalleryProps = {
  images: ListingDetailImage[];
  title: string;
  availabilityLabel: string;
  statusBadgeClassName: string;
};

export default function ListingGallery({
  images,
  title,
  availabilityLabel,
  statusBadgeClassName,
}: ListingGalleryProps) {
  const [selectedImageId, setSelectedImageId] = useState(images[0]?.id ?? "");

  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? images[0];

  return (
    <section className="space-y-4">
      <Card className="overflow-hidden p-3 sm:p-4">
        <div className="relative overflow-hidden rounded-[28px] bg-slate-100">
          <div className="absolute left-4 top-4 z-10">
            <Badge className={statusBadgeClassName}>{availabilityLabel}</Badge>
          </div>

          <div className="aspect-[5/4] w-full bg-[radial-gradient(circle_at_top,#dbeafe,transparent_55%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]">
            <img
              src={selectedImage.imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
        {images.slice(0, 6).map((image, index) => {
          const isActive = image.id === selectedImage.id;

          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImageId(image.id)}
              className={cn(
                "group overflow-hidden rounded-[22px] border bg-white p-1.5 text-left shadow-sm transition duration-200",
                isActive
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-md",
              )}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={isActive}
            >
              <div className="aspect-square overflow-hidden rounded-[16px] bg-slate-100">
                <img
                  src={image.imageUrl}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
