import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

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
                <span className="text-[#1a2332] font-display font-bold text-xl">W</span>
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
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
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
                <Link href="/properties?type=buy" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/properties?type=sell" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link href="/properties?type=rent" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/properties?category=residential" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Residential
                </Link>
              </li>
              <li>
                <Link href="/properties?category=commercial" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
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
                  123 Luxury Boulevard, Downtown<br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href="tel:+12125551234" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  +1 (212) 555-1234
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href="mailto:info@winstrealtors.com" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  info@winstrealtors.com
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
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}