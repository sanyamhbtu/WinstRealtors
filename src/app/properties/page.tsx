"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";


import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/shared/PropertyCard";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string | number;
  title: string;
  location: string;
  price: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  category: string;
  status?: string;
  featured?: boolean;
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
  });

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/properties?limit=100");
        if (res.ok) {
          const data = await res.json();
          // Transform API data to match PropertyCard interface
          const transformedData = data.map((prop: any) => ({
            id: prop.id.toString(),
            title: prop.title,
            location: prop.location,
            price: prop.price,
            image: prop.image || "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/ultra-luxury-modern-mansion-exterior-con-d9c1a564-20251121133418.jpg",
            bedrooms: prop.bedrooms || 0,
            bathrooms: prop.bathrooms || 0,
            area: prop.area || "",
            type: prop.category === "Rent" ? "For Rent" : "For Sale",
            category: prop.type?.toLowerCase() || "residential",
            status: prop.status,
            featured: prop.featured,
          }));
          setProperties(transformedData);
        } else {
          toast.error("Failed to load properties");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Initialize filters from URL parameters
  useEffect(() => {
    const location = searchParams.get("location") || "";
    const category = searchParams.get("category") || "";
    const priceRange = searchParams.get("priceRange") || "";
    
    const newFilters = { ...filters, location, category };
    
    // Parse price range from URL
    if (priceRange) {
      if (priceRange === "$0 - $5M") {
        newFilters.priceMin = "0";
        newFilters.priceMax = "5000000";
      } else if (priceRange === "$5M - $10M") {
        newFilters.priceMin = "5000000";
        newFilters.priceMax = "10000000";
      } else if (priceRange === "$10M - $20M") {
        newFilters.priceMin = "10000000";
        newFilters.priceMax = "20000000";
      } else if (priceRange === "$20M+") {
        newFilters.priceMin = "20000000";
        newFilters.priceMax = "";
      }
    }
    
    setFilters(newFilters);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      category: "",
      priceMin: "",
      priceMax: "",
      bedrooms: "",
      bathrooms: "",
      location: "",
    });
  };

  // Filter properties based on active filters
  const filteredProperties = properties.filter((property) => {
    // Location filter
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category && property.category !== filters.category) {
      return false;
    }

    // Type filter (sale/rent)
    if (filters.type) {
      const typeMatch = filters.type === "sale" ? "For Sale" : "For Rent";
      if (property.type !== typeMatch) {
        return false;
      }
    }

    // Price filter
    const priceValue = parseInt(property.price.replace(/[$,]/g, ""));
    if (filters.priceMin && priceValue < parseInt(filters.priceMin)) {
      return false;
    }
    if (filters.priceMax && priceValue > parseInt(filters.priceMax)) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }

    // Bathrooms filter
    if (filters.bathrooms && property.bathrooms < parseInt(filters.bathrooms)) {
      return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a2332] to-[#2d3e50] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Luxury Properties
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Discover exceptional estates, penthouses, and commercial properties in the world's most desirable locations
          </p>
        </div>
      </section>

      {/* Filters and Listings */}
      <section className="py-12 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-semibold text-[#1a2332]">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-600 hover:text-[#D4AF37]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, State, or Zip"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">All Types</option>
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">All Categories</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                      <input
                        type="text"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  {loading ? (
                    <span>Loading properties...</span>
                  ) : (
                    <>
                      <span className="font-semibold text-[#1a2332]">{filteredProperties.length}</span> properties found
                    </>
                  )}
                </p>
                <div className="flex items-center gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Bedrooms</option>
                  </select>
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setShowFilters(true)}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property.id} {...{ ...property, id: String(property.id) }} />
                    ))}
                  </div>

                  {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-xl text-gray-600 mb-4">No properties found matching your criteria</p>
                      <Button
                        onClick={clearFilters}
                        className="bg-[#D4AF37] hover:bg-[#C4A030] text-white"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredProperties.length > 0 && (
                    <div className="flex justify-center mt-12 space-x-2">
                      <Button variant="outline" disabled>Previous</Button>
                      <Button className="bg-[#D4AF37] hover:bg-[#C4A030] text-white">1</Button>
                      <Button variant="outline">2</Button>
                      <Button variant="outline">3</Button>
                      <Button variant="outline">Next</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}