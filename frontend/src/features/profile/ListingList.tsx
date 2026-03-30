import Card from "@/components/ui/Card";

import ListingCard from "./ListingCard";
import type { ProfileListing, ProfileTab } from "./types";

type ListingListProps = {
  listings: ProfileListing[];
  activeTab: ProfileTab;
  deletingListingId: string | null;
  archivingListingId: string | null;
  editingListingId: string | null;
  onEdit: (listingId: string) => void;
  onMarkAsSold: (listingId: string) => void;
  onDelete: (listingId: string) => void;
};

export default function ListingList({
  listings,
  activeTab,
  deletingListingId,
  archivingListingId,
  editingListingId,
  onEdit,
  onMarkAsSold,
  onDelete,
}: ListingListProps) {
  if (listings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          No listings in this section
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Your active, archived, and sold items will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 py-10 px-10">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          activeTab={activeTab}
          isDeleting={deletingListingId === listing.id}
          isArchiving={archivingListingId === listing.id}
          isEditing={editingListingId === listing.id}
          onEdit={onEdit}
          onMarkAsSold={onMarkAsSold}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
