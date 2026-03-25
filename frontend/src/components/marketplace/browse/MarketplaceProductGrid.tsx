import { SearchX } from "lucide-react";
import Link from "next/link";

import CategoryBadge from "./products/CategoryBadge";
import ProductImage from "./products/ProductImage";
import ProductInfo from "./products/ProductInfo";
import type { MarketplaceCategory, MarketplaceProduct } from "./types";

type MarketplaceProductGridProps = {
  products: MarketplaceProduct[];
  categoriesById: Record<string, MarketplaceCategory>;
};

function MarketplaceProductCard({
  product,
  category,
}: {
  product: MarketplaceProduct;
  category: MarketplaceCategory;
}) {
  return (
    <article className="group flex h-full flex-col rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/70">
      <Link
        href={`/listings/${product.id}`}
        className="block rounded-[24px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <ProductImage
          src={product.imageSrc}
          alt={product.imageAlt}
          objectPosition={product.imagePosition}
          overlayClassName={product.imageOverlayClassName}
        >
          <CategoryBadge
            label={category.name}
            className={category.badgeClassName}
          />
        </ProductImage>
      </Link>

      <div className="mt-4 flex flex-1 flex-col gap-4">
        <Link
          href={`/listings/${product.id}`}
          className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <ProductInfo
            title={product.title}
            price={product.price}
            description={product.description}
          />
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${product.seller.avatarClassName}`}
            >
              {product.seller.initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {product.seller.name}
              </p>
              <p className="text-xs text-slate-500">{product.listedAtLabel}</p>
            </div>
          </div>

          <Link
            href={`/listings/${product.id}`}
            className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function MarketplaceProductGrid({
  products,
  categoriesById,
}: MarketplaceProductGridProps) {
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
      {products.map((product) => {
        const category = categoriesById[product.categoryId];

        if (!category) {
          return null;
        }

        return (
          <MarketplaceProductCard
            key={product.id}
            product={product}
            category={category}
          />
        );
      })}
    </div>
  );
}
