import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatVndPrice } from "../marketplace-detail/utils";

import type { FavoriteItem } from "./types";

type FavoritesListingCardProps = {
  item: FavoriteItem;
  isPending: boolean;
  onRemove: (listingId: string) => Promise<void>;
};

export default function FavoritesListingCard({
  item,
  isPending,
  onRemove,
}: FavoritesListingCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.32)]">
      <div className="relative overflow-hidden rounded-[24px]">
        <Link
          href={`/listings/${item.id}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="relative aspect-[1.05/1] overflow-hidden rounded-[24px] bg-slate-100">
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/5 to-transparent" />
          </div>
        </Link>

        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${item.categoryBadgeClassName}`}
          >
            {item.categoryName}
          </span>
        </div>

        <button
          type="button"
          aria-label="Remove from favorites"
          title="Remove from favorites"
          disabled={isPending}
          onClick={() => {
            void onRemove(item.id);
          }}
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-rose-500 shadow-lg backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Heart className="h-4 w-4 fill-current" />
          <span>Saved</span>
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Link
            href={`/listings/${item.id}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-950">
              {item.title}
            </h2>
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {item.description}
          </p>
        </div>

        <p className="text-2xl font-bold tracking-tight text-slate-950">
          {formatVndPrice(item.price)}
        </p>

        <div className="flex items-center gap-3 rounded-[22px] bg-slate-50 p-3 ring-1 ring-slate-200/80">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {item.seller.avatarUrl ? (
              <Image
                src={item.seller.avatarUrl}
                alt={item.seller.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              item.seller.initials
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {item.seller.name}
            </p>
            <p className="truncate text-xs text-slate-500">{item.seller.locationLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/listings/${item.id}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Details
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              void onRemove(item.id);
            }}
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
