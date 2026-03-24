"use client";

import { useState } from "react";

import FilterSidebar from "./FilterSidebar";
import MarketplaceHero from "./MarketplaceHero";
import {
  MARKETPLACE_MAX_PRICE,
  MARKETPLACE_PAGE_SIZE,
  marketplaceCategoriesById,
  marketplaceProducts,
} from "./data";
import ProductSection from "./ProductSection";
import type { MarketplaceCondition, SortOption } from "./types";

export default function MarketplaceListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MARKETPLACE_MAX_PRICE);
  const [selectedCondition, setSelectedCondition] =
    useState<MarketplaceCondition>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = marketplaceProducts
    .filter((product) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const searchableContent = [
        product.title,
        product.description,
        marketplaceCategoriesById[product.categoryId]?.name ?? "",
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
            selectedCategoryIds={selectedCategoryIds}
            onToggleCategory={toggleCategory}
            maxPrice={maxPrice}
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

          <ProductSection
            products={paginatedProducts}
            categoriesById={marketplaceCategoriesById}
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
        </div>
      </section>
    </div>
  );
}
