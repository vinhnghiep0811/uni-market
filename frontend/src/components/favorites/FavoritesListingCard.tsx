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

    <article className=" group flex h-full w-full flex-col rounded-[15px] bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative">
        <Link
          href={`/listings/${item.id}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-[15px] bg-slate-100">
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
          className="absolute right-4 top-4 items-center gap-2 rounded-full bg-white/95 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-rose-500 shadow-lg backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Heart className="h-3 w-3 fill-current" />
          <span>Saved</span>
        </button>
      </div>

      <div className="p-5 flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <div className="grid grid-cols-[minmax(0,1fr)_96px] items-start justify-between gap-x-3">
            <Link
              href={`/listings/${item.id}`}
              className="block"
            >
              <h2 className="line-clamp-2 text-sm font-semibold text-slate-950">
                {item.title}
              </h2>


            </Link>

            <p className="shrink-0 text-right text-sm font-semibold text-slate-950">
              {formatVndPrice(item.price)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {item.seller.avatarUrl ? (
                <Image
                  src={item.seller.avatarUrl}
                  alt={item.seller.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                item.seller.initials
              )}
            </div>

            <div className="min-w-0 flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">
                {item.seller.name}
              </p>
              <p className="truncate text-xs text-slate-500">{item.seller.locationLabel}</p>
            </div>
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
