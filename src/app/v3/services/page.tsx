import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  TrendingUp, 
  FileText,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  WalletCards,
  KeyRound,
  Banknote
} from "lucide-react";
import LeftSideBar from "@/components/shared/LeftSideBar";
export default function ServicesPage() {
const services = [
  {
    icon: Home,
    title: "Property Buying",
    description: "Simplified property buying with verified options and expert guidance.",
    features: [
      "Verified residential & commercial listings",
      "Property shortlisting support",
      "Site visits & documentation help",
      "Negotiation and closing assistance"
    ],
  },
  {
    icon: WalletCards, 
    title: "Property Selling",
    description: "Professional assistance to sell your property quickly and transparently.",
    features: [
      "Accurate property valuation",
      "Marketing & listing support",
      "Buyer coordination",
      "Secure documentation handling"
    ],
  },
  {
    icon: KeyRound,
    title: "Property Leasing",
    description: "End-to-end leasing services for both tenants and landlords.",
    features: [
      "Rental property listing",
      "Tenant screening",
      "Lease agreement assistance",
      "Move-in coordination"
    ],
  },
  {
    icon: TrendingUp,
    title: "Investment Consultancy",
    description: "Smart, data-driven guidance for profitable real estate investments.",
    features: [
      "ROI & risk analysis",
      "Investment planning",
      "Market insights",
      "Portfolio guidance"
    ],
  },
  {
    icon: Briefcase,
    title: "Property Management",
    description: "Reliable management services to maintain and maximize property value.",
    features: [
      "Tenant coordination",
      "Maintenance management",
      "Rent collection",
      "Regular inspections"
    ],
  },
  {
    icon: FileText,
    title: "Legal Documentation",
    description: "Complete assistance with legal paperwork for smooth transactions.",
    features: [
      "Agreement drafting",
      "Title verification",
      "Property registration support",
      "Compliance checks"
    ],
  },
  {
    icon: Banknote,
    title: "Home Loan Assistance",
    description: "Guidance to help clients secure the right home loan with ease.",
    features: [
      "Loan eligibility check",
      "Documentation support",
      "Bank partner coordination",
      "Application guidance"
    ],
  },
];


const process = [
  {
    step: "01",
    title: "Understanding Your Requirements",
    description: "We begin by identifying your needs, budget, and preferred property type or service."
  },
  {
    step: "02",
    title: "Property Search & Shortlisting",
    description: "Our team finds verified options and shortlists the most suitable properties for you."
  },
  {
    step: "03",
    title: "Site Visits & Evaluation",
    description: "We arrange property visits and help you evaluate each option with clarity and confidence."
  },
  {
    step: "04",
    title: "Negotiation & Finalization",
    description: "We assist in securing the best price and terms, ensuring a fair and transparent deal."
  },
  {
    step: "05",
    title: "Legal Documentation",
    description: "Our team supports agreement drafting, verification, and all required paperwork."
  },
  {
    step: "06",
    title: "Closing & Assistance",
    description: "We guide you through the closing process and offer continued support, including loan and move-in help."
  },
];


  return (
    <main className="min-h-screen pt-20">
      <LeftSideBar />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dxxielg5u/image/upload/v1765512137/2_gpzwys.jpg"
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
                Our investment consulting services guide you in making smart and secure real estate decisions. We help identify high-potential opportunities, analyze market trends, and create strategies that support long-term growth.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Investment planning and opportunity analysis",
                  "Risk evaluation and smart decision guidance",
                  "Market insights for better returns",
                  "ROI improvement and long-term value creation"
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
                <Link href="/v3/consultation">
                  Schedule Consultation <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://res.cloudinary.com/dxxielg5u/image/upload/v1765512423/3_rh0wih.png"
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
              <Link href="/v3/contact">
                Contact Us <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white text-lg px-8 py-6"
            >
              <Link href="/v3/properties">View Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
