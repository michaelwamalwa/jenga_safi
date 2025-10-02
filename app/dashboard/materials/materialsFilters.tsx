"use client";
import { motion } from "framer-motion";
import { SortOption } from "@/lib/materials/types";

interface MaterialsFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  estimatedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const categories = [
  { value: "all", label: "All Materials" },
  { value: "concrete", label: "Concrete" },
  { value: "steel", label: "Steel" },
  { value: "wood", label: "Wood" },
  { value: "insulation", label: "Insulation" },
  { value: "finishes", label: "Finishes" },
  { value: "other", label: "Other" }
];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "carbon", label: "Lowest Carbon" },
  { value: "price", label: "Lowest Price" },
  { value: "rating", label: "Highest Rating" }
];

export function MaterialsFilters({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  estimatedQuantity,
  onQuantityChange
}: MaterialsFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
            Search Materials
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search by name, supplier, or certification..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-foreground mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mt-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-2">
          Estimated Quantity (kg)
          <span className="text-muted-foreground text-xs ml-2">
            Used for carbon savings calculation
          </span>
        </label>
        <div className="flex items-center gap-4">
          <input
            id="quantity"
            type="range"
            min="100"
            max="10000"
            step="100"
            value={estimatedQuantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-lg font-semibold text-primary min-w-[80px]">
            {estimatedQuantity.toLocaleString()} kg
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>100 kg</span>
          <span>10,000 kg</span>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedCategory !== "all" && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {categories.find(c => c.value === selectedCategory)?.label}
            <button
              onClick={() => onCategoryChange("all")}
              className="ml-2 hover:text-primary/70"
            >
              ×
            </button>
          </span>
        )}
        {searchTerm && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Search: "{searchTerm}"
            <button
              onClick={() => onSearchChange("")}
              className="ml-2 hover:text-blue-600"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </motion.div>
  );
}