import DynamicPriceRangeSlider from "@/components/marketplace/browse/DynamicPriceRangeSlider";
import CategoryFilter from "@/components/marketplace/browse/filters/CategoryFilter";
import SellItemCard from "@/components/marketplace/browse/filters/SellItemCard";
import type { MarketplaceCategory } from "@/components/marketplace/browse/types";

import type { FavoriteCategoryFilter } from "./types";

type FavoritesSidebarProps = {
  categories: MarketplaceCategory[];
  selectedCategory: FavoriteCategoryFilter;
  onSelectCategory: (value: FavoriteCategoryFilter) => void;
  maxPrice: number;
  priceCeiling: number;
  onChangeMaxPrice: (value: number) => void;
};

export default function FavoritesSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  maxPrice,
  priceCeiling,
  onChangeMaxPrice,
}: FavoritesSidebarProps) {
  return (
    <div className="space-y-5">
      <CategoryFilter
        categories={categories}
        selectedCategoryIds={[selectedCategory]}
        onToggleCategory={(categoryId) =>
          onSelectCategory(
            categoryId === selectedCategory
              ? "all"
              : (categoryId as FavoriteCategoryFilter),
          )
        }
      />
      <DynamicPriceRangeSlider
        value={maxPrice}
        ceiling={priceCeiling}
        onChange={onChangeMaxPrice}
      />
      <SellItemCard />
    </div>
  );
}
