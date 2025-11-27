import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building2, 
  TrendingUp, 
  Calculator,
  FileText,
  Users,
  Briefcase,
  Globe,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Residential Sales",
      description: "Expert guidance in buying and selling luxury homes, estates, and penthouses with personalized service.",
      features: [
        "Property valuation and pricing strategy",
        "Professional photography and marketing",
        "Exclusive buyer network access",
        "Negotiation and closing support"
      ],
    },
    {
      icon: Building2,
      title: "Commercial Real Estate",
      description: "Comprehensive solutions for office buildings, retail spaces, and mixed-use developments.",
      features: [
        "Market analysis and feasibility studies",
        "Tenant representation",
        "Investment property analysis",
        "Lease negotiations"
      ],
    },
    {
      icon: TrendingUp,
      title: "Investment Consulting",
      description: "Strategic advice for building and managing profitable real estate investment portfolios.",
      features: [
        "ROI analysis and projections",
        "Portfolio diversification strategies",
        "Market trend insights",
        "Risk assessment and mitigation"
      ],
    },
    {
      icon: Calculator,
      title: "Property Valuation",
      description: "Accurate property appraisals using advanced market analysis and comparable sales data.",
      features: [
        "Comparative market analysis",
        "Professional appraisal services",
        "Investment property evaluation",
        "Pre-sale pricing strategy"
      ],
    },
    {
      icon: FileText,
      title: "Legal & Documentation",
      description: "Comprehensive support for all legal aspects of real estate transactions.",
      features: [
        "Contract review and preparation",
        "Title search and insurance",
        "Closing coordination",
        "Compliance verification"
      ],
    },
    {
      icon: Users,
      title: "Relocation Services",
      description: "Full-service relocation assistance for individuals and corporate clients.",
      features: [
        "Area orientation and tours",
        "School and community information",
        "Temporary housing solutions",
        "Moving coordination support"
      ],
    },
    {
      icon: Briefcase,
      title: "Property Management",
      description: "Professional management services to maximize your property's value and returns.",
      features: [
        "Tenant screening and placement",
        "Rent collection and accounting",
        "Maintenance coordination",
        "Regular property inspections"
      ],
    },
    {
      icon: Globe,
      title: "International Properties",
      description: "Access to exclusive luxury properties in prime locations worldwide.",
      features: [
        "Global network of partners",
        "International market expertise",
        "Currency and legal guidance",
        "Virtual tours and documentation"
      ],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We begin with an in-depth conversation to understand your needs, goals, and preferences."
    },
    {
      step: "02",
      title: "Market Analysis",
      description: "Our team conducts comprehensive research and analysis to identify the best opportunities."
    },
    {
      step: "03",
      title: "Property Selection",
      description: "We curate a selection of properties that match your criteria and arrange exclusive viewings."
    },
    {
      step: "04",
      title: "Negotiation",
      description: "Our expert negotiators work to secure the best possible terms and price for your transaction."
    },
    {
      step: "05",
      title: "Due Diligence",
      description: "Thorough inspection, verification, and documentation to ensure a smooth transaction."
    },
    {
      step: "06",
      title: "Closing & Beyond",
      description: "We manage the closing process and provide ongoing support for all your real estate needs."
    },
  ];

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/sophisticated-luxury-real-estate-office--14854e03-20251121133417.jpg"
            alt="Our Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 to-[#1a2332]/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-shadow-luxury">
            Comprehensive Real Estate Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            From residential sales to investment consulting, we provide expert solutions for all your luxury real estate needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#1a2332] mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored solutions for every aspect of luxury real estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F5E6C8] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1a2332] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#1a2332] mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A proven approach to achieving exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[#fafaf8] rounded-lg p-8 h-full">
                  <div className="font-display text-6xl font-bold text-[#D4AF37] opacity-20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#1a2332] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting CTA */}
      <section className="py-20 luxury-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">
                Investment Consulting
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Our investment consulting services help you build and manage a profitable real estate portfolio. We provide strategic advice, market analysis, and ongoing support to maximize your returns.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Portfolio diversification strategies",
                  "Risk assessment and mitigation",
                  "Market trend analysis and forecasting",
                  "ROI optimization and tax efficiency"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C4A030] text-white"
              >
                <Link href="/consultation">
                  Schedule Consultation <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/elegant-luxury-penthouse-interior-modern-47fc35ea-20251121133417.jpg"
                alt="Investment Consulting"
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Contact us today to discuss how our services can help you achieve your real estate goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C4A030] text-white text-lg px-8 py-6"
            >
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white text-lg px-8 py-6"
            >
              <Link href="/properties">View Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
