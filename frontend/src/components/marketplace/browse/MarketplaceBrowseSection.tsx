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
  resultCount,
  sortOption,
  onChangeSort,
  currentPage,
  totalPages,
  onPageChange,
}: MarketplaceBrowseSectionProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        resultCount={resultCount}
        sortOption={sortOption}
        onChangeSort={onChangeSort}
      />
      <MarketplaceProductGrid
        products={products}
        categoriesById={categoriesById}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
