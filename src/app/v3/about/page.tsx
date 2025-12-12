"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Globe, TrendingUp, Shield, Heart, Zap } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Victoria Sterling",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      bio: "25+ years of luxury real estate expertise",
    },
    {
      name: "Marcus Chen",
      role: "Chief Investment Officer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bio: "Former Goldman Sachs real estate analyst",
    },
    {
      name: "Isabella Romano",
      role: "Director of Sales",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Top producer with $500M+ in sales",
    },
    {
      name: "Alexander Wright",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Digital strategy and luxury branding expert",
    },
    {
      name: "Sophia Martinez",
      role: "Senior Agent",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Specialist in waterfront properties",
    },
    {
      name: "James Anderson",
      role: "Legal Counsel",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Real estate law and contract specialist",
    },
  ];

  const values = [
    {
      icon: Award,
      title: "Professionalism",
      description: "Timely service with complete responsibility",
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Honest and transparent deals",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Personalized guidance and dedicated support",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Embracing smart tools and fresh ideas to simplify every transaction.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Creating long-term value for clients and investors",
    },
    {
      icon: Heart,
      title: "Quality",
      description: " Verified listings and accurate information",
    },
  ];

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/professional-luxury-real-estate-team-por-8b5a601f-20251121133534.jpg"
            alt="About Winst Realtors"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 to-[#1a2332]/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-shadow-luxury">
            Excellence in Luxury Real Estate
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            Since 2025, we've been the trusted partner for discerning clients seeking exceptional properties worldwide
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-[#1a2332] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  WINST Realtors Pvt. Ltd., founded in 2025 by Mr. Jagdish Saini, began with a clear purpose: to simplify the real estate experience for buyers, sellers, and investors. What started as a vision soon transformed into a trusted name built on transparency and commitment.
                </p>
                <p>
                  From offering residential and commercial services, the company quickly earned a reputation for professional guidance and smooth, hassle-free property transactions. Clients appreciated the clarity, support, and confidence WINST brought to every step of the process.
                </p>
                <p>
                  Today, WINST Realtors continues to expand with a strong network, a skilled team, and a customer-centric approach at its core. With every project, the company stays dedicated to delivering reliable service and shaping a better real estate journey for all.
                </p>
              </div>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/sophisticated-luxury-real-estate-office--14854e03-20251121133417.jpg"
                alt="Our Office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 luxury-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-[#D4AF37] mb-2">2+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-[#D4AF37] mb-2">25+</div>
              <div className="text-gray-300">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-[#D4AF37] mb-2">₹42L+</div>
              <div className="text-gray-300">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-[#D4AF37] mb-2">98%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#1a2332] mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F5E6C8] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#1a2332] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#1a2332] mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry experts dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-[#fafaf8] rounded-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-[#1a2332] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#D4AF37] font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#1a2332] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">
                Why Choose Winst Realtors?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2">Proven Trust & Transparency</h3>
                    <p className="text-gray-300">
                      Known for honest deals, reliable documentation, and smooth property transactions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2">Strong Local Network</h3>
                    <p className="text-gray-300">
                      Offering a growing range of verified residential and commercial properties across prime locations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2">Dedicated & Professional Team</h3>
                    <p className="text-gray-300">
                      Skilled experts providing personalized guidance, timely service, and accurate market insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/ultra-luxury-modern-mansion-exterior-con-d9c1a564-20251121133418.jpg"
                alt="Luxury Property"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-bold text-[#1a2332] mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Let's discuss how we can help you achieve your real estate goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C4A030] text-white text-lg px-8 py-6"
            >
              <Link href="/consultation">
                Schedule Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white text-lg px-8 py-6"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
