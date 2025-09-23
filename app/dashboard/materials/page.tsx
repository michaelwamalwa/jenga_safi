// app/components/materialsHub.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SustainableMaterial, Supplier } from "@/types";
import DashboardHeader from "../components/header";
interface MaterialsHubProps {
  onMaterialSelect?: (material: SustainableMaterial) => void;
}

export default function MaterialsHub({ onMaterialSelect }: MaterialsHubProps) {
  const [materials, setMaterials] = useState<SustainableMaterial[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"carbon" | "price" | "rating">("carbon");
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // Fetch materials and suppliers
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [materialsRes, suppliersRes] = await Promise.all([
        fetch("/api/materials"),
        fetch("/api/suppliers"),
      ]);

      if (!materialsRes.ok) throw new Error("Failed to fetch materials");
      if (!suppliersRes.ok) throw new Error("Failed to fetch suppliers");

      const materialsData = await materialsRes.json();
      const suppliersData = await suppliersRes.json();

      setMaterials(materialsData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort materials
  const filteredMaterials = materials
    .filter((material) => {
      const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "carbon":
          return a.ecoImpact.carbonFootprint - b.ecoImpact.carbonFootprint;
        case "price":
          return a.price - b.price;
        case "rating":
          return (b.supplier?.rating || 0) - (a.supplier?.rating || 0);
        default:
          return 0;
      }
    });

  const categories = [
    "all",
    "concrete",
    "steel",
    "wood",
    "insulation",
    "finishes",
    "other",
  ];

  const getEcoImpactColor = (carbonFootprint: number) => {
    if (carbonFootprint < 50) return "bg-emerald-100 text-emerald-800";
    if (carbonFootprint < 150) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high": return "bg-emerald-100 text-emerald-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading sustainable materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="text-center py-12 text-destructive">
          <p>Error loading materials: {error}</p>
          <button
            onClick={fetchData}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sustainable Materials Hub</h2>
          <p className="text-sm text-muted-foreground">
            Source eco-friendly materials from local Nairobi suppliers
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
          >
            + Add Supplier
          </button>
          <button
            onClick={() => setShowMaterialModal(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            + Add Material
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-muted/30 p-4 rounded-lg border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Sort By</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="carbon">Lowest Carbon</option>
              <option value="price">Lowest Price</option>
              <option value="rating">Supplier Rating</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Search</label>
            <input
              type="text"
              placeholder="Search materials, suppliers, or descriptions..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <motion.div
            key={material._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-foreground text-lg">{material.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${getAvailabilityColor(material.availability)}`}>
                {material.availability}
              </span>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {material.description}
            </p>

            {/* Eco Impact Metrics */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Carbon Footprint:</span>
                <span className={`px-2 py-1 rounded text-xs ${getEcoImpactColor(material.ecoImpact.carbonFootprint)}`}>
                  {material.ecoImpact.carbonFootprint} kg CO₂/{material.unit}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Water Usage:</span>
                <span className="text-sm font-medium">
                  {material.ecoImpact.waterUsage} L/{material.unit}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recyclability:</span>
                <span className="text-sm font-medium">
                  {material.ecoImpact.recyclability}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Properties:</span>
                <div className="flex gap-1">
                  {material.ecoImpact.renewable && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs">Renewable</span>
                  )}
                  {material.ecoImpact.local && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Local</span>
                  )}
                </div>
              </div>
            </div>

            {/* Supplier Info */}
            {material.supplier && (
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {material.supplier.name}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {material.supplier.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{material.supplier.location}</p>
                <p className="text-xs text-muted-foreground">{material.supplier.contact}</p>
                
                {material.supplier.certification.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {material.supplier.certification.slice(0, 3).map((cert) => (
                        <span
                          key={cert}
                          className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs"
                        >
                          {cert}
                        </span>
                      ))}
                      {material.supplier.certification.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{material.supplier.certification.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price and Action */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-foreground">
                  KES {material.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground ml-1">/{material.unit}</span>
              </div>
              
              {onMaterialSelect && (
                <button
                  onClick={() => onMaterialSelect(material)}
                  className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Select
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No materials found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search or filters."
              : "No sustainable materials available yet. Add your first material to get started."
            }
          </p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-muted/30 p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground">{materials.length}</div>
          <div className="text-sm text-muted-foreground">Total Materials</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground">{suppliers.length}</div>
          <div className="text-sm text-muted-foreground">Local Suppliers</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-emerald-600">
            {Math.min(...materials.map(m => m.ecoImpact.carbonFootprint))}
          </div>
          <div className="text-sm text-muted-foreground">Lowest Carbon (kg CO₂)</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground">
            {categories.length}
          </div>
          <div className="text-sm text-muted-foreground">Material Categories</div>
        </div>
      </div>

      {/* Modals for adding new suppliers and materials would go here */}
      {/* You would implement similar modals to the ProjectList component */}
    </div>
  );
}