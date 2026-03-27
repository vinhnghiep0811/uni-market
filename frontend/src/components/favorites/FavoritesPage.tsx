"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import { apiRequest } from "@/lib/api";

import FavoritesEmptyState from "./FavoritesEmptyState";
import FavoritesGrid from "./FavoritesGrid";
import FavoritesHeader from "./FavoritesHeader";
import FavoritesSidebar from "./FavoritesSidebar";
import type {
  FavoriteApiRecord,
  FavoriteCategoryFilter,
  FavoriteItem,
  FavoriteSortOption,
} from "./types";
import {
  buildFavoriteCategorySummaries,
  buildFavoriteSidebarCategories,
  mapFavoriteItem,
  sortFavoriteItems,
} from "./utils";

function FavoritesLoadingState() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <Card className="space-y-4 rounded-[28px] p-5">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
        <div className="h-48 animate-pulse rounded-[24px] bg-blue-100/70" />
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="rounded-[28px] p-4">
            <div className="aspect-[1.05/1] animate-pulse rounded-[24px] bg-slate-200" />
            <div className="mt-4 h-5 w-24 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-6 w-3/4 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="mt-5 h-11 animate-pulse rounded-[22px] bg-slate-100" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<FavoriteCategoryFilter>("all");
  const [sortOption, setSortOption] =
    useState<FavoriteSortOption>("Recently Saved");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await apiRequest<FavoriteApiRecord[]>("/favorites");

        if (!isMounted) {
          return;
        }

        setItems(response.map(mapFavoriteItem));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setItems([]);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load your saved items right now.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const priceFloor =
    items.length > 0
      ? items.reduce((floor, item) => Math.min(floor, item.price), items[0].price)
      : 0;
  const priceCeiling =
    items.length > 0
      ? items.reduce(
          (ceiling, item) => Math.max(ceiling, item.price),
          items[0].price,
        )
      : 0;
  const effectiveMaxPrice =
    items.length > 0 ? (maxPrice === 0 ? priceCeiling : maxPrice) : 0;

  useEffect(() => {
    if (items.length === 0) {
      setMaxPrice(0);
      return;
    }

    setMaxPrice((current) => {
      if (current === 0) {
        return priceCeiling;
      }

      return Math.max(Math.min(current, priceCeiling), priceFloor);
    });
  }, [items.length, priceFloor, priceCeiling]);

  const categorySummaries = buildFavoriteCategorySummaries(items);
  const sidebarCategories = buildFavoriteSidebarCategories(categorySummaries);

  const visibleItems = sortFavoriteItems(
    items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.categoryFilter === selectedCategory;
      const matchesPrice =
        items.length === 0 || item.price <= effectiveMaxPrice;

      return matchesCategory && matchesPrice;
    }),
    sortOption,
  );

  const hasActiveFilters =
    selectedCategory !== "all" ||
    (items.length > 0 && effectiveMaxPrice < priceCeiling);

  const handleRemoveFavorite = async (listingId: string) => {
    if (pendingIds.includes(listingId)) {
      return;
    }

    const removedItem = items.find((item) => item.id === listingId);

    if (!removedItem) {
      return;
    }

    setPendingIds((current) => [...current, listingId]);
    setItems((current) => current.filter((item) => item.id !== listingId));

    try {
      await apiRequest(`/favorites/${listingId}`, {
        method: "DELETE",
      });
    } catch (error) {
      setItems((current) => {
        if (current.some((item) => item.id === listingId)) {
          return current;
        }

        return sortFavoriteItems([...current, removedItem], sortOption);
      });
      console.error("Could not remove favorite item.", error);
    } finally {
      setPendingIds((current) => current.filter((id) => id !== listingId));
    }
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(priceCeiling);
  };

  return (
    <section className="min-h-[calc(100vh-73px)] px-4 py-8 sm:px-6 lg:px-8 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl space-y-6">
        <FavoritesHeader
          resultCount={items.length}
          sortOption={sortOption}
          onChangeSort={setSortOption}
          onToggleFilters={() => setIsFiltersOpen((current) => !current)}
        />

        {loadError ? (
          <Card className="rounded-[28px] border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="inline-flex h-10 items-center justify-center rounded-full bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Try again
              </button>
            </div>
          </Card>
        ) : null}

        {isLoading ? (
          <FavoritesLoadingState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className={`${isFiltersOpen ? "block" : "hidden"} lg:block`}>
              <div className="lg:sticky lg:top-24">
                <FavoritesSidebar
                  categories={sidebarCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  maxPrice={effectiveMaxPrice}
                  priceCeiling={priceCeiling}
                  onChangeMaxPrice={setMaxPrice}
                />
              </div>
            </aside>

            <div className="space-y-5">
              {/* <div className="flex items-center justify-between gap-3 rounded-[24px] bg-white/75 px-5 py-4 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Saved listings
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    {visibleItems.length} item{visibleItems.length === 1 ? "" : "s"}
                  </h2>
                </div>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Reset Filters
                  </button>
                ) : null}
              </div> */}

              {items.length === 0 ? (
                <FavoritesEmptyState />
              ) : visibleItems.length === 0 ? (
                <FavoritesEmptyState
                  hasActiveFilters
                  onResetFilters={resetFilters}
                />
              ) : (
                <FavoritesGrid
                  items={visibleItems}
                  pendingIds={pendingIds}
                  onRemove={handleRemoveFavorite}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
