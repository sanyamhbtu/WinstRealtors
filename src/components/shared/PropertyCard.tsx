"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  featured?: boolean;
}

export default function PropertyCard({
  id,
  title,
  location,
  price,
  image,
  bedrooms,
  bathrooms,
  area,
  type,
  featured = false,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {featured && (
            <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
          <span className="bg-[#1a2332] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {type}
          </span>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isFavorite
              ? "bg-[#D4AF37] text-white"
              : "bg-white/90 text-gray-600 hover:bg-[#D4AF37] hover:text-white"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-display text-xl font-semibold text-[#1a2332] mb-2 group-hover:text-[#D4AF37] transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-4">
          {bedrooms > 0 && (
            <div className="flex items-center space-x-1 text-gray-600 text-sm">
              <Bed className="w-4 h-4" />
              <span>{bedrooms}</span>
            </div>
          )}
          {bathrooms > 0 && (
            <div className="flex items-center space-x-1 text-gray-600 text-sm">
              <Bath className="w-4 h-4" />
              <span>{bathrooms}</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-gray-600 text-sm">
            <Square className="w-4 h-4" />
            <span>{area}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Price</p>
            <p className="font-display text-2xl font-bold text-[#D4AF37]">{price}</p>
          </div>
          <Button
            asChild
            className="bg-[#1a2332] hover:bg-[#2d3e50] text-white"
          >
            <Link href={`/v3/properties/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
