import { SearchX } from "lucide-react";

import type { MarketplaceCategory, MarketplaceProduct } from "../types";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: MarketplaceProduct[];
  categoriesById: Record<string, MarketplaceCategory>;
};

export default function ProductGrid({
  products,
  categoriesById,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <SearchX className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          No items match your filters
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Try widening your price range or selecting fewer categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categoriesById[product.categoryId]}
        />
      ))}
    </div>
  );
}
