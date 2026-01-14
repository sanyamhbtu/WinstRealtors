"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LeftSideBar from "@/components/shared/LeftSideBar";
interface GalleryImage {
  id: number;
  image: string;
  title: string;
  category: string;
  description?: string;
  published?: boolean;
}

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "All Properties" },
    { id: "exterior", name: "Exteriors" },
    { id: "interior", name: "Interiors" },
    { id: "amenities", name: "Amenities" },
  ];

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery-items?limit=100");
        if (res.ok) {
          const data = await res.json();
          // Transform API data and filter published items
          const transformedData = data
            .filter((item: any) => item.published)
            .map((item: any) => ({
              id: item.id,
              image: item.image,
              title: item.title,
              category: item.category?.toLowerCase() || "exterior",
              description: item.description,
              published: item.published,
            }));
          setGalleryImages(transformedData);
        } else {
          toast.error("Failed to load gallery images");
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        toast.error("Failed to load gallery images");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <main className="min-h-screen pt-20">
      <LeftSideBar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a2332] to-[#2d3e50] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Property Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Explore our stunning collection of luxury properties through professional photography
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#D4AF37] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No gallery images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.image}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-display text-xl font-bold mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm text-gray-300">{image.description}</p>
                      )}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
          >
            <span className="text-white text-2xl">‹</span>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
          >
            <span className="text-white text-2xl">›</span>
          </button>

          <div className="max-w-7xl max-h-[90vh] mx-auto px-4">
            <div className="relative aspect-video">
              <Image
                src={filteredImages[currentImage].image}
                alt={filteredImages[currentImage].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center mt-6 text-white">
              <h3 className="font-display text-2xl font-bold mb-2">
                {filteredImages[currentImage].title}
              </h3>
              {filteredImages[currentImage].description && (
                <p className="text-gray-300">{filteredImages[currentImage].description}</p>
              )}
              <p className="text-sm text-gray-400 mt-4">
                {currentImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}