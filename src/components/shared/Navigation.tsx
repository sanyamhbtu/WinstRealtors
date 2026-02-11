"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event : MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPropertiesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const propertyLinks = [
    { name: "Buy Property", href: "/v3/properties?type=buy" },
    { name: "Sell Property", href: "/v3/properties?type=sell" },
    { name: "Rent Property", href: "/v3/properties?type=rent" },
    { name: "Commercial", href: "/v3/properties?category=commercial" },
    { name: "Residential", href: "/v3/properties?category=residential" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white lg:bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-20 h-20 md:w-25 md:h-25 lg:w-25 lg-h-25  rounded flex items-center justify-center">
              <img src="https://res.cloudinary.com/dxxielg5u/image/upload/v1764957758/winst-removebg-preview_qancvd.png" alt="Winst Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-[#1a2332]">
                Winst Realtors
              </span>
              <span className="text-xs text-[#8b8b8b] tracking-wider">
                PRIVATE LIMITED
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
            >
              Home
            </Link>
            
            {/* Properties Dropdown */}
            <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setPropertiesOpen(prev => !prev)}
        className="flex items-center space-x-1 text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
      >
        <span>Properties</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {propertiesOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
          {propertyLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setPropertiesOpen(false)}   // close on item click
              className="block px-4 py-2.5 text-sm text-[#1a2332] hover:bg-[#fafaf8] hover:text-[#D4AF37] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>

            <Link
              href="/v3/about"
              className="text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/v3/services"
              className="text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              href="/v3/gallery"
              className="text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
            >
              Gallery
            </Link>
            <Link
              href="/v3/blog"
              className="text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/v3/contact"
              className="text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              asChild
              variant="outline"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
            >
              <Link href="/v3/consultation">Book Consultation</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[#1a2332] hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/"
              className="block text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="space-y-2">
              <div className="text-[#1a2332] font-medium">Properties</div>
              <div className="pl-4 space-y-2">
                {propertyLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-sm text-[#8b8b8b] hover:text-[#D4AF37] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/v3/about"
              className="block text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/v3/services"
              className="block text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/v3/gallery"
              className="block text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/v3/blog"
              className="block text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/v3/contact"
              className="block text-[#1a2332] hover:text-[#D4AF37] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Button
              asChild
              className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white"
            >
              <Link href="/v3/consultation" onClick={() => setMobileMenuOpen(false)}>
                Book Consultation
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}