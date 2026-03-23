import type {
  MarketplaceCategory,
  MarketplaceProduct,
  SortOption,
} from "./types";
import Pagination from "./products/Pagination";
import ProductGrid from "./products/ProductGrid";
import SectionHeader from "./products/SectionHeader";

type ProductSectionProps = {
  products: MarketplaceProduct[];
  categoriesById: Record<string, MarketplaceCategory>;
  resultCount: number;
  sortOption: SortOption;
  onChangeSort: (value: SortOption) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ProductSection({
  products,
  categoriesById,
  resultCount,
  sortOption,
  onChangeSort,
  currentPage,
  totalPages,
  onPageChange,
}: ProductSectionProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        resultCount={resultCount}
        sortOption={sortOption}
        onChangeSort={onChangeSort}
      />
      <ProductGrid products={products} categoriesById={categoriesById} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
