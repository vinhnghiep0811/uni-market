import { CONDITION_OPTIONS } from "./data";
import DynamicPriceRangeSlider from "./DynamicPriceRangeSlider";
import CategoryFilter from "./filters/CategoryFilter";
import ConditionFilter from "./filters/ConditionFilter";
import SellItemCard from "./filters/SellItemCard";
import type { MarketplaceCategory, MarketplaceCondition } from "./types";

type FilterSidebarProps = {
  categories: MarketplaceCategory[];
  selectedCategoryIds: string[];
  onToggleCategory: (categoryId: string) => void;
  maxPrice: number;
  priceCeiling: number;
  onChangeMaxPrice: (value: number) => void;
  selectedCondition: MarketplaceCondition;
  onChangeCondition: (condition: MarketplaceCondition) => void;
};

export default function FilterSidebar({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  maxPrice,
  priceCeiling,
  onChangeMaxPrice,
  selectedCondition,
  onChangeCondition,
}: FilterSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="space-y-5">
        <CategoryFilter
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
          onToggleCategory={onToggleCategory}
        />
        <DynamicPriceRangeSlider
          value={maxPrice}
          ceiling={priceCeiling}
          onChange={onChangeMaxPrice}
        />
        <ConditionFilter
          conditions={CONDITION_OPTIONS}
          selectedCondition={selectedCondition}
          onChange={onChangeCondition}
        />
        <SellItemCard />
      </div>
    </aside>
  );
}
