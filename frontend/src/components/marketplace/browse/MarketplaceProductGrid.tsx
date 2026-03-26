import { Heart, SearchX } from "lucide-react";
import Link from "next/link";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import CategoryBadge from "./products/CategoryBadge";
import ProductImage from "./products/ProductImage";
import ProductInfo from "./products/ProductInfo";
import type { MarketplaceCategory, MarketplaceProduct } from "./types";

type MarketplaceProductGridProps = {
  products: MarketplaceProduct[];
  categoriesById: Record<string, MarketplaceCategory>;
  favoritePendingIds: string[];
  purchasePendingIds: string[];
  onToggleFavorite: (listingId: string) => Promise<void>;
  onPurchase: (listingId: string) => Promise<void>;
};

function getPurchasePresentation(product: MarketplaceProduct) {
  if (product.isOwnedByCurrentUser) {
    return {
      buttonLabel: "Your listing",
      helperText: "You cannot create an order for your own listing.",
      disabled: true,
      badge: "Your listing",
      badgeClassName: "bg-slate-100 text-slate-700",
    };
  }

  if (product.transactionStatus === "PENDING") {
    return {
      buttonLabel: "Request sent",
      helperText: "You already created a purchase request for this item.",
      disabled: true,
      badge: "Pending request",
      badgeClassName: "bg-blue-100 text-blue-700",
    };
  }

  if (product.transactionStatus === "ACCEPTED") {
    return {
      buttonLabel: "In progress",
      helperText: "The seller accepted your request. Continue in your profile.",
      disabled: true,
      badge: "Your order accepted",
      badgeClassName: "bg-amber-100 text-amber-800",
    };
  }

  if (product.status === "IN_TRANSACTION") {
    return {
      buttonLabel: "Unavailable",
      helperText: "This item is currently being handled in another transaction.",
      disabled: true,
      badge: "In transaction",
      badgeClassName: "bg-amber-100 text-amber-800",
    };
  }

  return {
    buttonLabel: "Dat mua",
    helperText: "Create an order and wait for the seller to respond.",
    disabled: false,
    badge: "Available",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  };
}

function MarketplaceProductCard({
  product,
  category,
  isFavoritePending,
  isPurchasePending,
  onToggleFavorite,
  onPurchase,
}: {
  product: MarketplaceProduct;
  category: MarketplaceCategory;
  isFavoritePending: boolean;
  isPurchasePending: boolean;
  onToggleFavorite: (listingId: string) => Promise<void>;
  onPurchase: (listingId: string) => Promise<void>;
}) {
  const purchasePresentation = getPurchasePresentation(product);

  return (
    <article className="group flex h-full flex-col rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative">
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

        <button
          type="button"
          aria-label={product.isFavorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={product.isFavorited}
          title={product.isFavorited ? "Remove from favorites" : "Add to favorites"}
          disabled={isFavoritePending}
          onClick={() => {
            void onToggleFavorite(product.id);
          }}
          className={`absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-70 ${product.isFavorited ? "bg-white text-rose-500 ring-1 ring-rose-200/80 hover:bg-rose-50" : "bg-slate-950/55 text-white hover:bg-slate-950/70"}`}
        >
          <Heart
            className={`h-5 w-5 transition ${product.isFavorited ? "fill-current" : "fill-transparent"}`}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Badge className={purchasePresentation.badgeClassName}>
            {purchasePresentation.badge}
          </Badge>
          <p className="text-xs font-medium text-slate-400">
            {product.listedAtLabel}
          </p>
        </div>

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

        <div className="rounded-[22px] bg-slate-50 p-4 ring-1 ring-slate-200/80">
          <p className="text-sm font-medium text-slate-900">
            {purchasePresentation.helperText}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Button
              size="sm"
              className="flex-1"
              disabled={purchasePresentation.disabled || isPurchasePending}
              onClick={() => {
                void onPurchase(product.id);
              }}
            >
              {isPurchasePending ? "Sending..." : purchasePresentation.buttonLabel}
            </Button>
            <Link
              href={`/listings/${product.id}`}
              className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              View details
            </Link>
          </div>
        </div>

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
              <p className="text-xs text-slate-500">{product.categoryName}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MarketplaceProductGrid({
  products,
  categoriesById,
  favoritePendingIds,
  purchasePendingIds,
  onToggleFavorite,
  onPurchase,
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
            isFavoritePending={favoritePendingIds.includes(product.id)}
            isPurchasePending={purchasePendingIds.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            onPurchase={onPurchase}
          />
        );
      })}
    </div>
  );
}
