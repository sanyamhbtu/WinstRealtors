"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/shared/PropertyCard";
import { ArrowRight, Building, DollarSign, Star, Award, ChevronLeft, ChevronRight, Search, Loader2, IndianRupee } from "lucide-react";
import { toast } from "sonner";

import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function Home() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [countUp, setCountUp] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  // State for fetched data
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch properties
        const propsRes = await fetch("/api/properties?limit=6&featured=true");
        if (propsRes.ok) {
          const propsData = await propsRes.json();
          setFeaturedProperties(propsData);
        }

        // Fetch testimonials
        const testimonialsRes = await fetch("/api/testimonials?limit=10");
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json();
          setTestimonials(testimonialsData);
        }

        // Fetch partners
        const partnersRes = await fetch("/api/partners?limit=20");
        if (partnersRes.ok) {
          const partnersData = await partnersRes.json();
          setPartners(partnersData);
        }

        // Fetch stats
        const statsRes = await fetch("/api/admin/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats([
            { 
              id: 1,
              label: "Properties Listed", 
              number: statsData.totalProperties?.toString() || "0",
              icon: "Building"
            },
            { 
              id: 2,
              label: "Happy Clients", 
              number: statsData.totalTestimonials?.toString() || "0",
              icon: "Star"
            },
            { 
              id: 3,
              label: "Years Experience", 
              number: "25+",
              icon: "Award"
            },
            { 
              id: 4,
              label: "Total Sales Value", 
              number: "₹25.5L+",
              icon: "DollarSign"
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load some content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountUp(true);
        }
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById("stats-section");
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchFilters.location) {
      params.set("location", searchFilters.location);
    }
    
    if (searchFilters.propertyType && searchFilters.propertyType !== "Property Type") {
      params.set("category", searchFilters.propertyType.toLowerCase());
    }
    
    if (searchFilters.priceRange && searchFilters.priceRange !== "Price Range") {
      params.set("priceRange", searchFilters.priceRange);
    }
    
    router.push(`/v3/properties${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const iconMap: Record<string, any> = {
    Building,
    DollarSign,
    Star,
    Award,
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dxxielg5u/image/upload/v1764959244/herowinstimage_mbqewn.jpg"
            alt="Luxury Property"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/90 via-[#1a2332]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-7xl font-bold  mb-6 leading-tight text-shadow-luxury">
              Discover Your Dream
              <span className="block text-[#D4AF37]">Luxury Estate</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Experience unparalleled elegance with our curated collection of the world's most prestigious properties.
            </p>

            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 shadow-2xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-gray-300 text-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <select 
                  value={searchFilters.propertyType}
                  onChange={(e) => setSearchFilters({ ...searchFilters, propertyType: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-gray-300 text-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option>Property Type</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                </select>
                <select 
                  value={searchFilters.priceRange}
                  onChange={(e) => setSearchFilters({ ...searchFilters, priceRange: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-gray-300 text-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option>Price Range</option>
                  <option>$0 - $5M</option>
                  <option>$5M - $10M</option>
                  <option>$10M - $20M</option>
                  <option>$20M+</option>
                </select>
              </div>
              <Button 
                onClick={handleSearch}
                className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white py-6 text-lg font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C4A030] text-white text-lg px-8 py-6"
              >
                <Link href="/v3/properties">
                  Explore Properties <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-black hover:bg-amber-50 hover:text-[#1a2332] text-lg px-8 py-6"
              >
                <Link href="/v3/consultation">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2 animate-bounce">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div> */}
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 bg-[#1a2332]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const Icon = iconMap[stat.icon];
                return (
                  <div key={stat.id} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#D4AF37] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-display text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-lg">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2332] mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of the most exclusive luxury estates
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.slice(0, 6).map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>

              <div className="text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#1a2332] hover:bg-[#2d3e50] text-white px-8"
                >
                  <Link href="/v3/properties">
                    View All Properties <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/sophisticated-luxury-real-estate-office--14854e03-20251121133417.jpg"
                alt="About Winst Realtors"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2332] mb-6">
                Excellence in Luxury Real Estate
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                With over 25 years of experience, Winst Realtors has established itself as the premier destination for luxury real estate. Our team of expert consultants provides personalized service to discerning clients worldwide.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We specialize in exclusive properties that represent the pinnacle of architectural design, prime locations, and exceptional value. From oceanfront estates to urban penthouses, we curate the finest selection of luxury real estate.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C4A030] text-white"
              >
                <Link href="/v3/about">
                  Learn More About Us <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 luxury-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Client Testimonials
            </h2>
            <p className="text-xl text-gray-300">
              Hear from our satisfied clients
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : testimonials.length > 0 ? (
            <>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-[#D4AF37] bg-gray-300">
                    {testimonials[currentTestimonial].image ? (
                      <Image
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-400">
                        <span className="text-white text-2xl font-bold">
                          {testimonials[currentTestimonial].name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-[#D4AF37] fill-current" />
                    ))}
                  </div>
                  <p className="text-xl italic mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <p className="font-display text-2xl font-semibold mb-1">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-300">{testimonials[currentTestimonial].role}</p>
                </div>

                {testimonials.length > 1 && (
                  <>
                    <button
                      onClick={prevTestimonial}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {testimonials.length > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentTestimonial ? "bg-[#D4AF37] w-8" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-300">No testimonials available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2332] mb-4">
              Our Trusted Partners
            </h2>
            <p className="text-xl text-gray-600">
              Collaborating with the world's leading real estate networks
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : partners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={200}
                    height={100}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No partners available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1a2332] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Schedule a private consultation with our luxury real estate experts today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C4A030] text-white text-lg px-8 py-6"
            >
              <Link href="/v3/consultation">
                Book Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-black hover:bg-amber-50 hover:text-[#1a2332] text-lg px-8 py-6"
            >
              <Link href="/v3/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
      <WhatsAppButton />
      <Footer />
    </main>
  );
}