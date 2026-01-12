import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a2332] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F5E6C8] rounded flex items-center justify-center">
                <img src="https://res.cloudinary.com/dxxielg5u/image/upload/v1764957758/winst-removebg-preview_qancvd.png" alt="Winst Logo" className = "w-15 h-15"/>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold">
                  Winst Realtors
                </span>
                <span className="text-xs text-[#8b8b8b] tracking-wider">
                  LUXURY ESTATES
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner in luxury real estate. We specialize in high-end properties
              and exceptional service for discerning clients.
            </p>
            <div className="flex space-x-4">
  <a
    href="https://www.facebook.com/61583892713142/?http_ref=eyJ0cyI6MTc2NTc0MTAxMDAwMCwiciI6IiJ9"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white
               flex items-center justify-center
               text-[#1877F2]
               transition-all duration-300
               hover:scale-110 hover:-translate-y-1"
  >
    <Facebook className="w-5 h-5" />
  </a>

  <a
    href="https://www.instagram.com/winst_realtors/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white
               flex items-center justify-center
               text-[#E4405F]
               transition-all duration-300
               hover:scale-110 hover:-translate-y-1"
  >
    <Instagram className="w-5 h-5" />
  </a>

  <a
    href="https://www.linkedin.com/in/winst-realtors-private-limited-b4830a398/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white
               flex items-center justify-center
               text-[#0A66C2]
               transition-all duration-300
               hover:scale-110 hover:-translate-y-1"
  >
    <Linkedin className="w-5 h-5" />
  </a>

  <a
    href="https://www.youtube.com/@WinstRealtors"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white
               flex items-center justify-center
               text-[#FF0000]
               transition-all duration-300
               hover:scale-110 hover:-translate-y-1"
  >
    <Youtube className="w-5 h-5" />
  </a>
</div>


          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/v3/about" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/v3/properties" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/v3/services" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/v3/gallery" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/v3/blog" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/v3/contact" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Property Types</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/v3/properties?type=buy" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/v3/properties?type=sell" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link href="/v3/properties?type=rent" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/v3/properties?category=residential" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Residential
                </Link>
              </li>
              <li>
                <Link href="/v3/properties?category=commercial" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/v3/consultation" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  The Galleria Square,<br />26, Harsh Commercial Park,  Garh Road Meerut,<br /> near Vivan Hospital Meerut <br /> Uttar Pradesh, India <br/> 250002
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href="tel:+919634396117" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  +91 9634396117
                </a>
                <br />
                <a href="tel:+918130184250" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  +91 8130184250
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href="mailto:info@winstrealtors.com" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  info@winstrealtors.com
                </a> <br />
                <a href="mailto:sales@winstrealtors.com" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  sales@winstrealtors.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Winst Realtors. All rights reserved.
            </p>
            {/* <div className="flex space-x-6">
              <Link href="/v3/privacy" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/v3/terms" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/v3/sitemap" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                Sitemap
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}