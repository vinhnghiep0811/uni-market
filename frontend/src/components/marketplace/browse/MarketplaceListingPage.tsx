"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import {
  isActiveTransactionStatus,
  type TransactionStatus,
  type TransactionListResponse,
  type TransactionMutationResponse,
} from "@/lib/transactions";

import FilterSidebar from "./FilterSidebar";
import MarketplaceHero from "./MarketplaceHero";
import {
  buildMarketplaceCategories,
  buildMarketplaceCategoriesById,
  MARKETPLACE_FETCH_LIMIT,
  MARKETPLACE_MAX_PRICE,
  MARKETPLACE_PAGE_SIZE,
  mapListingToMarketplaceProduct,
} from "./data";
import MarketplaceBrowseSection from "./MarketplaceBrowseSection";
import type {
  MarketplaceCategory,
  MarketplaceListingsResponse,
  MarketplaceListingApi,
  MarketplaceProduct,
  MarketplaceCondition,
  SortOption,
} from "./types";

async function fetchMarketplaceListings() {
  const firstPage = await apiRequest<MarketplaceListingsResponse>(
    `/listings?page=1&limit=${MARKETPLACE_FETCH_LIMIT}`,
  );

  const remainingPageRequests: Array<Promise<MarketplaceListingsResponse>> = [];

  for (let page = 2; page <= firstPage.meta.totalPages; page += 1) {
    remainingPageRequests.push(
      apiRequest<MarketplaceListingsResponse>(
        `/listings?page=${page}&limit=${MARKETPLACE_FETCH_LIMIT}`,
      ),
    );
  }

  const remainingPages = await Promise.all(remainingPageRequests);
  return [firstPage, ...remainingPages].flatMap((response) => response.data);
}

async function fetchMyRequests() {
  const response =
    await apiRequest<TransactionListResponse>("/transactions/my-requests");

  return response.data;
}

function buildMarketplaceState(
  listings: MarketplaceListingApi[],
  currentUserId?: string,
  activeTransactionsByListingId?: Map<string, TransactionStatus>,
) {
  const uniqueCategories = new Map<string, MarketplaceListingApi["category"]>();

  listings.forEach((listing) => {
    uniqueCategories.set(listing.category.id, listing.category);
  });

  const categoryList = Array.from(uniqueCategories.values());

  return {
    products: listings.map((listing) =>
      mapListingToMarketplaceProduct(listing, {
        currentUserId,
        transactionStatus:
          activeTransactionsByListingId?.get(listing.id) ?? null,
      }),
    ),
    categories: buildMarketplaceCategories(categoryList),
    categoriesById: buildMarketplaceCategoriesById(categoryList),
  };
}

function buildActiveTransactionsByListingId(
  transactions: Awaited<ReturnType<typeof fetchMyRequests>>,
): Map<string, TransactionStatus> {
  const activeTransactions = transactions
    .filter((transaction) => isActiveTransactionStatus(transaction.status))
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );

  return new Map(
    activeTransactions.map((transaction) => [
      transaction.listingId,
      transaction.status,
    ]),
  );
}

export default function MarketplaceListingPage() {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [favoritePendingIds, setFavoritePendingIds] = useState<string[]>([]);
  const [purchasePendingIds, setPurchasePendingIds] = useState<string[]>([]);
  const [transactionFeedback, setTransactionFeedback] = useState<string | null>(
    null,
  );
  const [transactionFeedbackTone, setTransactionFeedbackTone] = useState<
    "success" | "error"
  >("success");
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [categoriesById, setCategoriesById] = useState<
    Record<string, MarketplaceCategory>
  >({});
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MARKETPLACE_MAX_PRICE);
  const [selectedCondition, setSelectedCondition] =
    useState<MarketplaceCondition>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadListings = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [listings, myRequests] = await Promise.all([
        fetchMarketplaceListings(),
        currentUserId ? fetchMyRequests() : Promise.resolve([]),
      ]);
      const nextState = buildMarketplaceState(
        listings,
        currentUserId,
        buildActiveTransactionsByListingId(myRequests),
      );

      setProducts(nextState.products);
      setCategories(nextState.categories);
      setCategoriesById(nextState.categoriesById);
    } catch (error) {
      setProducts([]);
      setCategories([]);
      setCategoriesById({});
      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not load listings right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialListings = async () => {
      try {
        const [listings, myRequests] = await Promise.all([
          fetchMarketplaceListings(),
          currentUserId ? fetchMyRequests() : Promise.resolve([]),
        ]);
        const nextState = buildMarketplaceState(
          listings,
          currentUserId,
          buildActiveTransactionsByListingId(myRequests),
        );

        if (!isMounted) {
          return;
        }

        setProducts(nextState.products);
        setCategories(nextState.categories);
        setCategoriesById(nextState.categoriesById);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setCategories([]);
        setCategoriesById({});
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load listings right now.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    void loadInitialListings();

    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

  const priceCeiling = products.reduce(
    (ceiling, product) => Math.max(ceiling, product.price),
    MARKETPLACE_MAX_PRICE,
  );

  useEffect(() => {
    setMaxPrice(priceCeiling);
  }, [priceCeiling]);

  const filteredProducts = products
    .filter((product) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const searchableContent = [
        product.title,
        product.description,
        product.categoryName,
      ]
        .join(" ")
        .toLowerCase();
      const matchesCategory =
        selectedCategoryIds.length === 0 ||
        selectedCategoryIds.includes(product.categoryId);
      const matchesPrice = product.price <= maxPrice;
      const matchesCondition =
        selectedCondition === "All" || product.condition === selectedCondition;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        searchableContent.includes(normalizedQuery);

      return (
        matchesCategory && matchesPrice && matchesCondition && matchesSearch
      );
    })
    .sort((left, right) => {
      if (sortOption === "Price: Low to High") {
        return left.price - right.price;
      }

      if (sortOption === "Price: High to Low") {
        return right.price - left.price;
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / MARKETPLACE_PAGE_SIZE),
  );

  const effectiveCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (effectiveCurrentPage - 1) * MARKETPLACE_PAGE_SIZE,
    effectiveCurrentPage * MARKETPLACE_PAGE_SIZE,
  );

  const toggleCategory = (categoryId: string) => {
    setCurrentPage(1);
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((item) => item !== categoryId)
        : [...current, categoryId],
    );
  };

  const handleToggleFavorite = async (listingId: string) => {
    if (favoritePendingIds.includes(listingId)) {
      return;
    }

    let nextFavoriteState: boolean | null = null;

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== listingId) {
          return product;
        }

        nextFavoriteState = !product.isFavorited;

        return {
          ...product,
          isFavorited: nextFavoriteState,
        };
      }),
    );

    if (nextFavoriteState === null) {
      return;
    }

    setFavoritePendingIds((current) => [...current, listingId]);

    try {
      await apiRequest(`/favorites/${listingId}`, {
        method: nextFavoriteState ? "POST" : "DELETE",
      });
    } catch (error) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === listingId
            ? {
                ...product,
                isFavorited: !nextFavoriteState!,
              }
            : product,
        ),
      );
      console.error("Could not update favorite status.", error);
    } finally {
      setFavoritePendingIds((current) =>
        current.filter((id) => id !== listingId),
      );
    }
  };

  const handlePurchase = async (listingId: string) => {
    if (purchasePendingIds.includes(listingId)) {
      return;
    }

    setTransactionFeedback(null);
    setPurchasePendingIds((current) => [...current, listingId]);

    try {
      const response = await apiRequest<TransactionMutationResponse>(
        "/transactions",
        {
          method: "POST",
          body: { listingId },
        },
      );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === listingId
            ? {
                ...product,
                transactionStatus: response.data?.status ?? "PENDING",
              }
            : product,
        ),
      );
      setTransactionFeedback("Purchase request sent. Track it in your profile.");
      setTransactionFeedbackTone("success");
    } catch (error) {
      setTransactionFeedback(
        error instanceof Error ? error.message : "Could not create request.",
      );
      setTransactionFeedbackTone("error");
    } finally {
      setPurchasePendingIds((current) =>
        current.filter((id) => id !== listingId),
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f8fafc] pb-8">
      <MarketplaceHero
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setCurrentPage(1);
          setSearchQuery(value);
        }}
        onSelectTag={(tag) => {
          setCurrentPage(1);
          setSearchQuery(tag);
        }}
      />

      <section id="marketplace-listings" className="px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <FilterSidebar
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onToggleCategory={toggleCategory}
            maxPrice={maxPrice}
            priceCeiling={priceCeiling}
            onChangeMaxPrice={(value) => {
              setCurrentPage(1);
              setMaxPrice(value);
            }}
            selectedCondition={selectedCondition}
            onChangeCondition={(condition) => {
              setCurrentPage(1);
              setSelectedCondition(condition);
            }}
          />

          <div className="space-y-4">
            {transactionFeedback ? (
              <div
                className={`rounded-3xl px-5 py-4 text-sm ${
                  transactionFeedbackTone === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {transactionFeedback}
              </div>
            ) : null}

            {loadError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p>{loadError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      void loadListings();
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Marketplace</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Loading listings
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fetching the latest published items from Uni Market.
                </p>
              </div>
            ) : (
              <MarketplaceBrowseSection
                products={paginatedProducts}
                categoriesById={categoriesById}
                favoritePendingIds={favoritePendingIds}
                purchasePendingIds={purchasePendingIds}
                onToggleFavorite={handleToggleFavorite}
                onPurchase={handlePurchase}
                resultCount={filteredProducts.length}
                sortOption={sortOption}
                onChangeSort={(value) => {
                  setCurrentPage(1);
                  setSortOption(value);
                }}
                currentPage={effectiveCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
