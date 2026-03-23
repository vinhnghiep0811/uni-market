import { Archive, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { ProfileListing, ProfileTab } from "./types";
import { formatVndPrice } from "./utils";

type ListingCardProps = {
  listing: ProfileListing;
  activeTab: ProfileTab;
  isDeleting: boolean;
  isArchiving: boolean;
  isEditing: boolean;
  onEdit: (listingId: string) => void;
  onMarkAsSold: (listingId: string) => void;
  onDelete: (listingId: string) => void;
};

export default function ListingCard({
  listing,
  activeTab,
  isDeleting,
  isArchiving,
  isEditing,
  onEdit,
  onMarkAsSold,
  onDelete,
}: ListingCardProps) {
  const isArchivedView = activeTab === "archived-sold";

  return (
    <Card className="p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-[22px] sm:w-28">
          <Image
            src={listing.imageSrc}
            alt={listing.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 112px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <Badge className={listing.categoryClassName}>
                {listing.categoryLabel}
              </Badge>
              <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-900">
                {listing.title}
              </h3>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {formatVndPrice(listing.price)}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {listing.description}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                {listing.updatedAtLabel}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<Pencil className="h-4 w-4" />}
                disabled={isEditing}
                onClick={() => onEdit(listing.id)}
              >
                {isEditing ? "Editing..." : "Edit"}
              </Button>

              {!isArchivedView ? (
                <Button
                  variant="ghost"
                  size="sm"
                  leadingIcon={<Archive className="h-4 w-4" />}
                  disabled={isArchiving}
                  onClick={() => onMarkAsSold(listing.id)}
                >
                  {isArchiving ? "Updating..." : "Mark as Sold"}
                </Button>
              ) : null}

              <Button
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={() => onDelete(listing.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
