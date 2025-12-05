"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Mail,
  MessageCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  category: string;
  status: string;
  description: string | null;
  image: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch property data from API
  
  const { id } = React.use(params);
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties?id=${id}`);
        if (!res.ok) {
          toast.error("Property not found");
          return;
        }
        const data = await res.json();
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Show error state if property not found
  if (!property) {
    return (
      <div className="min-h-screen pt-20 bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-[#1a2332] mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
            <Link href="/v3/properties">Back to Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Combine primary image with additional images for gallery
  const allImages = [property.image, ...(property.images || [])].filter(Boolean);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Mock agent data (you can enhance this later with real agent data)
  const agent = {
    name: "Vanshika Tomar",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    phone: "+91 3892849982",
    email: "hr@winstrealtors.com",
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Image Gallery */}
      <section className="relative">
        <div className="relative h-[70vh] bg-black">
          <Image
            src={allImages[currentImage]}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Navigation Arrows - Only show if multiple images */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6 text-[#1a2332]" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-10"
              >
                <ChevronRight className="w-6 h-6 text-[#1a2332]" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentImage + 1} / {allImages.length}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <button className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all">
              <Share2 className="w-5 h-5 text-[#1a2332]" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isFavorite ? "bg-[#D4AF37] text-white" : "bg-white/90 hover:bg-white text-[#1a2332]"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip - Only show if multiple images */}
        {allImages.length > 1 && (
          <div className="bg-black/90 py-4">
            <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                    index === currentImage ? "ring-4 ring-[#D4AF37]" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  console.log("imgses", {img});
                  <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Property Details */}
      <section className="py-12 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {property.category}
                      </span>
                      <span className="bg-[#1a2332] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {property.type}
                      </span>
                      {property.featured && (
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                    <h1 className="font-display text-4xl font-bold text-[#1a2332] mb-3">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 text-lg">
                      <MapPin className="w-5 h-5 mr-2" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Price</p>
                    <p className="font-display text-4xl font-bold text-[#D4AF37]">
                      {property.price}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#fafaf8] rounded-lg flex items-center justify-center">
                      <Bed className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#1a2332]">{property.bedrooms}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#fafaf8] rounded-lg flex items-center justify-center">
                      <Bath className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#1a2332]">{property.bathrooms}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#fafaf8] rounded-lg flex items-center justify-center">
                      <Square className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#1a2332]">{property.area}</p>
                      <p className="text-sm text-gray-600">Area</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#fafaf8] rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#1a2332]">2</p>
                      <p className="text-sm text-gray-600">Parking</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-lg p-8 shadow-md">
                  <h2 className="font-display text-2xl font-bold text-[#1a2332] mb-4">
                    Property Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="font-display text-2xl font-bold text-[#1a2332] mb-6">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Premium location",
                    "Modern design",
                    "High-quality finishes",
                    "Natural lighting",
                    "Spacious rooms",
                    "Storage space",
                    "Security system",
                    "Energy efficient"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              {/* <div className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="font-display text-2xl font-bold text-[#1a2332] mb-6">
                  Location
                </h2>
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Interactive map would be embedded here</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Google Maps integration with property location
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Agent Card */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-display text-xl font-bold text-[#1a2332] mb-4">
                    Contact Agent
                  </h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a2332]">{agent.name}</p>
                      <p className="text-sm text-gray-600">Senior Agent</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center space-x-3 text-gray-700 hover:text-[#D4AF37] transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center space-x-3 text-gray-700 hover:text-[#D4AF37] transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{agent.email}</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white"
                    >
                      <Link href="/consultation">
                        <Calendar className="w-5 h-5 mr-2" />
                        Book Viewing
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Property Info */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-display text-xl font-bold text-[#1a2332] mb-4">
                    Property Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Property ID</span>
                      <span className="font-semibold text-[#1a2332]">WR-{property.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-semibold text-[#1a2332]">{property.type}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category</span>
                      <span className="font-semibold text-[#1a2332]">{property.category}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Status</span>
                      <span className="font-semibold text-[#D4AF37]">{property.status}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                {/* <div className="bg-gradient-to-br from-[#1a2332] to-[#2d3e50] rounded-lg p-6 text-white">
                  <h3 className="font-display text-xl font-bold mb-3">
                    Need Financing?
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Get pre-qualified for a mortgage and understand your financing options
                  </p>
                  <Button className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white">
                    Calculate Mortgage
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-[#1a2332] mb-8">
            Similar Properties
          </h2>
          <p className="text-gray-600 mb-2">Similar luxury properties would be displayed here</p>
        </div>
      </section>
    </main>
  );
}