// scripts/seedMaterials.ts
import { connectDB } from "@/lib/db";
import SustainableMaterial from "@/app/models/sustainableMaterial";
import Supplier from "@/app/models/supplier";

const sampleSuppliers = [
  {
    name: "EcoBuild Kenya",
    location: "Nairobi Industrial Area",
    contact: "info@ecobuild.co.ke",
    rating: 4.8,
    certification: ["ISO 14001", "Green Building Council"],
    specialties: ["Bamboo", "Recycled Materials"]
  },
  {
    name: "Sustainable Concrete Ltd",
    location: "Mombasa Road, Nairobi",
    contact: "sales@sustainableconcrete.co.ke",
    rating: 4.5,
    certification: ["LEED Certified"],
    specialties: ["Low-carbon Concrete", "Green Cement"]
  }
];

const sampleMaterials = [
  {
    name: "Bamboo Flooring",
    description: "Sustainable bamboo flooring from local Kenyan bamboo",
    category: "finishes",
    price: 2500,
    unit: "sqm",
    availability: "high",
    ecoImpact: {
      carbonFootprint: 35,
      waterUsage: 120,
      recyclability: 85,
      renewable: true,
      local: true
    },
    supplier: "" // Will be populated with supplier ID
  },
  {
    name: "Low-Carbon Concrete",
    description: "Concrete with 40% less carbon footprint using fly ash",
    category: "concrete",
    price: 8500,
    unit: "cubic meter",
    availability: "medium",
    ecoImpact: {
      carbonFootprint: 180,
      waterUsage: 180,
      recyclability: 60,
      renewable: false,
      local: true
    },
    supplier: ""
  }
];

async function seedDatabase() {
  await connectDB();
  
  // Clear existing data
  await SustainableMaterial.deleteMany({});
  await Supplier.deleteMany({});
  
  // Create suppliers
  const createdSuppliers = await Supplier.insertMany(sampleSuppliers);
  
  // Create materials with supplier references
  const materialsWithSuppliers = sampleMaterials.map((material, index) => ({
    ...material,
    supplier: createdSuppliers[index % createdSuppliers.length]._id
  }));
  
  await SustainableMaterial.insertMany(materialsWithSuppliers);
  
  console.log("✅ Database seeded with sample materials!");
  process.exit(0);
}

seedDatabase().catch(console.error);