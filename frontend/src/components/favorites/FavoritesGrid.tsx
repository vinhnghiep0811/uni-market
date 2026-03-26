import FavoritesListingCard from "./FavoritesListingCard";
import type { FavoriteItem } from "./types";

type FavoritesGridProps = {
  items: FavoriteItem[];
  pendingIds: string[];
  onRemove: (listingId: string) => Promise<void>;
};

export default function FavoritesGrid({
  items,
  pendingIds,
  onRemove,
}: FavoritesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <FavoritesListingCard
          key={item.id}
          item={item}
          isPending={pendingIds.includes(item.id)}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
