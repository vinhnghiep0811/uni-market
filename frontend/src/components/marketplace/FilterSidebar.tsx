import { CONDITION_OPTIONS, marketplaceCategories } from "./data";
import CategoryFilter from "./filters/CategoryFilter";
import ConditionFilter from "./filters/ConditionFilter";
import PriceRangeSlider from "./filters/PriceRangeSlider";
import SellItemCard from "./filters/SellItemCard";
import type { MarketplaceCondition } from "./types";

type FilterSidebarProps = {
  selectedCategoryIds: string[];
  onToggleCategory: (categoryId: string) => void;
  maxPrice: number;
  onChangeMaxPrice: (value: number) => void;
  selectedCondition: MarketplaceCondition;
  onChangeCondition: (condition: MarketplaceCondition) => void;
};

export default function FilterSidebar({
  selectedCategoryIds,
  onToggleCategory,
  maxPrice,
  onChangeMaxPrice,
  selectedCondition,
  onChangeCondition,
}: FilterSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="space-y-5">
        <CategoryFilter
          categories={marketplaceCategories}
          selectedCategoryIds={selectedCategoryIds}
          onToggleCategory={onToggleCategory}
        />
        <PriceRangeSlider value={maxPrice} onChange={onChangeMaxPrice} />
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
