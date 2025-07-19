// app/dashboard/materials/page.jsx
"use client";
import React, { useState } from 'react';
import {
  Leaf, Recycle, Package, ShoppingBasket, 
  Factory, Trees, Warehouse, Activity, 
  Search, Plus, ChevronRight, ArrowUpDown,
  Filter, BarChart, CheckCircle, AlertCircle
} from 'lucide-react';

const GreenMaterialsDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Dummy materials data
  const materials = [
    {
      id: 1,
      name: "Bamboo Flooring",
      category: "Flooring",
      supplier: "EcoSupplies Inc.",
      ecoRating: 5,
      carbonFootprint: 12,
      quantity: 4500,
      unit: "sq ft",
      cost: 4.25,
      status: "in-stock",
      associatedProjects: ["Eco Tower Complex", "Riverfront Residences"],
      certifications: ["FSC", "GreenGuard"],
      lastDelivery: "2024-03-10"
    },
    {
      id: 2,
      name: "Recycled Steel Beams",
      category: "Structural",
      supplier: "GreenSteel Co.",
      ecoRating: 4,
      carbonFootprint: 85,
      quantity: 120,
      unit: "tons",
      cost: 850,
      status: "in-stock",
      associatedProjects: ["Solar Park Apartments", "Green Tech Campus"],
      certifications: ["LEED", "Cradle to Cradle"],
      lastDelivery: "2024-02-28"
    },
    {
      id: 3,
      name: "Low-VOC Paint",
      category: "Finishing",
      supplier: "EcoCoat Paints",
      ecoRating: 5,
      carbonFootprint: 8,
      quantity: 320,
      unit: "gallons",
      cost: 42.50,
      status: "low-stock",
      associatedProjects: ["Urban Green Hub", "Forest Heights"],
      certifications: ["GreenSeal", "LEED"],
      lastDelivery: "2024-01-15"
    },
    {
      id: 4,
      name: "Recycled Glass Countertops",
      category: "Surfaces",
      supplier: "Verde Surfaces",
      ecoRating: 4,
      carbonFootprint: 25,
      quantity: 85,
      unit: "slabs",
      cost: 1250,
      status: "on-order",
      associatedProjects: ["Eco Tower Complex", "Oceanview Condos"],
      certifications: ["SGS", "GreenGuard"],
      lastDelivery: "2024-02-05"
    },
    {
      id: 5,
      name: "Hemp Insulation",
      category: "Insulation",
      supplier: "NaturalFibers Ltd",
      ecoRating: 5,
      carbonFootprint: 6,
      quantity: 0,
      unit: "rolls",
      cost: 85.75,
      status: "on-order",
      associatedProjects: ["Mountain Eco Lodge"],
      certifications: ["USDA Organic", "Cradle to Cradle"],
      lastDelivery: "2023-12-20"
    },
    {
      id: 6,
      name: "Reclaimed Wood Paneling",
      category: "Wall Coverings",
      supplier: "Heritage Timber",
      ecoRating: 5,
      carbonFootprint: 15,
      quantity: 2200,
      unit: "sq ft",
      cost: 7.80,
      status: "in-stock",
      associatedProjects: ["Forest Heights", "Riverfront Residences"],
      certifications: ["FSC Reclaimed", "SGS"],
      lastDelivery: "2024-03-15"
    },
    {
      id: 7,
      name: "Solar Roof Tiles",
      category: "Roofing",
      supplier: "SunPower Solutions",
      ecoRating: 4,
      carbonFootprint: 105,
      quantity: 35,
      unit: "tiles",
      cost: 245,
      status: "low-stock",
      associatedProjects: ["Solar Park Apartments", "Green Tech Campus"],
      certifications: ["Energy Star", "LEED"],
      lastDelivery: "2024-02-22"
    },
    {
      id: 8,
      name: "Recycled Plastic Lumber",
      category: "Decking",
      supplier: "Plastix Renew",
      ecoRating: 3,
      carbonFootprint: 42,
      quantity: 1800,
      unit: "linear ft",
      cost: 12.25,
      status: "in-stock",
      associatedProjects: ["Urban Green Hub", "Riverfront Residences"],
      certifications: ["GreenCircle", "EPD"],
      lastDelivery: "2024-03-05"
    }
  ];

  // Sort materials
  const sortedMaterials = [...materials].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    if (sortField === 'ecoRating') {
      return sortDirection === 'asc' 
        ? a.ecoRating - b.ecoRating 
        : b.ecoRating - a.ecoRating;
    }
    if (sortField === 'carbonFootprint') {
      return sortDirection === 'asc' 
        ? a.carbonFootprint - b.carbonFootprint 
        : b.carbonFootprint - a.carbonFootprint;
    }
    if (sortField === 'cost') {
      return sortDirection === 'asc' 
        ? a.cost - b.cost 
        : b.cost - a.cost;
    }
    return 0;
  });

  const filteredMaterials = sortedMaterials.filter(item => {
    // Apply status filter
    if (activeFilter !== 'all' && item.status !== activeFilter) return false;
    
    // Apply search filter
    if (searchQuery && 
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.supplier.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Function to render eco rating
  const renderEcoRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Leaf 
            key={i} 
            size={16} 
            className={`${i < rating ? 'text-green-500 fill-green-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  // Function to get status details
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'in-stock':
        return { text: 'In Stock', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={16} /> };
      case 'low-stock':
        return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle size={16} /> };
      case 'on-order':
        return { text: 'On Order', color: 'bg-blue-100 text-blue-700', icon: <ShoppingBasket size={16} /> };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <Package size={16} /> };
    }
  };

  // Function to handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate sustainability metrics
  const categoryCount = materials.reduce((acc: Record<string, number>, mat) => {
    acc[mat.category] = (acc[mat.category] || 0) + 1;
    return acc;
  }, {});
  
  const topCategory = Object.entries(categoryCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  
  const sustainabilityMetrics = {
    avgCarbonFootprint: Math.round(
      materials.reduce((sum, mat) => sum + mat.carbonFootprint, 0) / materials.length
    ),
    recycledContent: Math.round(
      (materials.filter(mat =>
        mat.name.includes("Recycled") || mat.name.includes("Reclaimed")
      ).length / materials.length) * 100
    ),
    topCategory,
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Leaf className="text-green-600 mr-2" size={24} />
                Green Materials
              </h1>
              <p className="text-gray-600 mt-1">
                Track sustainable materials across all construction sites
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-[1.02]">
                <Plus className="mr-2" size={18} />
                <span>Add Material</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {['all', 'in-stock', 'low-stock', 'on-order'].map(filter => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                    activeFilter === filter
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' && <span>All Materials</span>}
                  {filter === 'in-stock' && (
                    <>
                      <Warehouse className="mr-2" size={16} />
                      <span>In Stock</span>
                    </>
                  )}
                  {filter === 'low-stock' && (
                    <>
                      <AlertCircle className="mr-2" size={16} />
                      <span>Low Stock</span>
                    </>
                  )}
                  {filter === 'on-order' && (
                    <>
                      <ShoppingBasket className="mr-2" size={16} />
                      <span>On Order</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search materials..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Total Materials</div>
            <div className="text-2xl font-bold mt-1">{materials.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Avg. Eco Rating</div>
            <div className="text-2xl font-bold mt-1 flex items-center">
              {renderEcoRating(Math.round(materials.reduce((sum, mat) => sum + mat.ecoRating, 0) / materials.length))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Avg. Carbon Footprint</div>
            <div className="text-2xl font-bold mt-1">
              {sustainabilityMetrics.avgCarbonFootprint} kg CO₂
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Recycled/Reclaimed</div>
            <div className="text-2xl font-bold mt-1">
              {sustainabilityMetrics.recycledContent}%
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-gray-600 text-sm font-medium">
            <div className="col-span-4 flex items-center">
              <button 
                className="flex items-center hover:text-gray-800"
                onClick={() => handleSort('name')}
              >
                <span>Material</span>
                {sortField === 'name' && (
                  <ArrowUpDown className="ml-1" size={14} />
                )}
              </button>
            </div>
            <div className="col-span-2">Supplier</div>
            <div className="col-span-1 flex items-center justify-center">
              <button 
                className="flex items-center hover:text-gray-800"
                onClick={() => handleSort('ecoRating')}
              >
                <span>Eco Rating</span>
                {sortField === 'ecoRating' && (
                  <ArrowUpDown className="ml-1" size={14} />
                )}
              </button>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <button 
                className="flex items-center hover:text-gray-800"
                onClick={() => handleSort('carbonFootprint')}
              >
                <span>CO₂</span>
                {sortField === 'carbonFootprint' && (
                  <ArrowUpDown className="ml-1" size={14} />
                )}
              </button>
            </div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-1 flex items-center justify-center">
              <button 
                className="flex items-center hover:text-gray-800"
                onClick={() => handleSort('cost')}
              >
                <span>Cost</span>
                {sortField === 'cost' && (
                  <ArrowUpDown className="ml-1" size={14} />
                )}
              </button>
            </div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Materials Rows */}
          <div className="divide-y divide-gray-100">
            {filteredMaterials.map((item) => {
              const statusDetails = getStatusDetails(item.status);
              return (
                <div 
                  key={item.id} 
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="col-span-4">
                    <div className="flex items-center">
                      <div className="bg-green-50 border border-green-100 rounded-lg p-2 mr-3">
                        <Package className="text-green-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <div className="text-sm text-gray-600 mt-1 flex items-center">
                          <Trees className="mr-1" size={14} />
                          <span>{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <Factory className="text-gray-500 mr-2" size={14} />
                      <span className="truncate">{item.supplier}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last delivery: {item.lastDelivery}
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex justify-center">
                    {renderEcoRating(item.ecoRating)}
                  </div>
                  
                  <div className="col-span-1 flex justify-center">
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                      {item.carbonFootprint} kg
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className={`${statusDetails.color} px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center`}>
                      <span className="truncate">{item.quantity} {item.unit}</span>
                    </div>
                    <div className="text-xs text-center mt-1">
                      {statusDetails.text}
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-center">
                    <div className="font-medium text-gray-800">
                      ${item.cost.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      per {item.unit}
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex justify-end items-center">
                    <button className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium">
                      View Details
                      <ChevronRight className="ml-1" size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredMaterials.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Leaf className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No materials found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {/* Sustainability Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2 text-green-600" size={20} />
            Sustainability Analytics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eco Ratings Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-medium text-gray-800 mb-4">Eco Ratings Distribution</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = materials.filter(mat => mat.ecoRating === rating).length;
                  const percentage = (count / materials.length) * 100;
                  
                  return (
                    <div key={rating} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {renderEcoRating(rating)}
                        <span className="ml-2 text-gray-700">{rating} {rating === 1 ? 'Leaf' : 'Leaves'}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600 text-sm">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Carbon Footprint Comparison */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-medium text-gray-800 mb-4">Carbon Footprint Comparison</h3>
              <div className="space-y-4">
                {materials
                  .sort((a, b) => b.carbonFootprint - a.carbonFootprint)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="text-gray-700 truncate mr-4">{item.name}</div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ 
                              width: `${(item.carbonFootprint / 150) * 100}%`,
                              backgroundColor: item.carbonFootprint > 50 ? 
                                (item.carbonFootprint > 100 ? '#ef4444' : '#f59e0b') : 
                                '#10b981'
                            }}
                          ></div>
                        </div>
                        <span className="text-gray-600 text-sm font-medium">{item.carbonFootprint} kg</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Material Certifications */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Recycle className="mr-2 text-green-600" size={20} />
            Material Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "FSC Certified", count: 3, icon: <Trees size={24} className="text-green-500" /> },
              { name: "LEED Compliant", count: 4, icon: <BarChart size={24} className="text-green-500" /> },
              { name: "Cradle to Cradle", count: 2, icon: <Recycle size={24} className="text-green-500" /> },
              { name: "GreenGuard Gold", count: 2, icon: <CheckCircle size={24} className="text-green-500" /> },
              { name: "Energy Star", count: 1, icon: <Activity size={24} className="text-green-500" /> },
              { name: "USDA Organic", count: 1, icon: <Leaf size={24} className="text-green-500" /> },
            ].map((cert, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 flex items-center">
                <div className="bg-green-50 p-3 rounded-lg mr-4">
                  {cert.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{cert.name}</h3>
                  <p className="text-gray-600">{cert.count} materials certified</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenMaterialsDashboard;