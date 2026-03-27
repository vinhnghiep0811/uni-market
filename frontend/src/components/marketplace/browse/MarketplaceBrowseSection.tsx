import type {
  MarketplaceCategory,
  MarketplaceProduct,
  SortOption,
} from "./types";
import MarketplaceProductGrid from "./MarketplaceProductGrid";
import Pagination from "./products/Pagination";
import SectionHeader from "./products/SectionHeader";

type MarketplaceBrowseSectionProps = {
  products: MarketplaceProduct[];
  categoriesById: Record<string, MarketplaceCategory>;
  favoritePendingIds: string[];
  purchasePendingIds: string[];
  onToggleFavorite: (listingId: string) => Promise<void>;
  onPurchase: (listingId: string) => Promise<void>;
  resultCount: number;
  sortOption: SortOption;
  onChangeSort: (value: SortOption) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function MarketplaceBrowseSection({
  products,
  categoriesById,
  favoritePendingIds,
  purchasePendingIds,
  onToggleFavorite,
  onPurchase,
  resultCount,
  sortOption,
  onChangeSort,
  currentPage,
  totalPages,
  onPageChange,
}: MarketplaceBrowseSectionProps) {
  return (
    <section className="space-y-0">
      <SectionHeader
        resultCount={resultCount}
        sortOption={sortOption}
        onChangeSort={onChangeSort}
      />
      <MarketplaceProductGrid
        products={products}
        categoriesById={categoriesById}
        favoritePendingIds={favoritePendingIds}
        purchasePendingIds={purchasePendingIds}
        onToggleFavorite={onToggleFavorite}
        onPurchase={onPurchase}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
