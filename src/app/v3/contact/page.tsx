"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import LeftSideBar from "@/components/shared/LeftSideBar";
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log("API Response:", data);
    if (!res.ok) {
      alert(data.error || "Failed to submit form");
      return;
    }
    alert("Form submitted successfully!");
    } catch (error) {
      console.error(error);
    alert("Something went wrong. Try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const offices = [
    {
      city: "Meerut",
      address: "The Galleria Square, 26, Harsh Commercial Park,  Garh Road Meerut, near Vivan Hospital  Meerut Uttar Pradesh, India, 250004",
      phone: "+91 96343 96117, +91 81301 84250",
      email: "sales@winstrealtors.com",
      hours: "Mon-Sun: 10:00 AM - 7:00 PM",
    }
  ];

  return (
    <main className="min-h-screen pt-20">
      <LeftSideBar />
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dxxielg5u/image/upload/v1765512814/5_nepnph.jpg"
            alt="Contact Us"
            fill
            className="object"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 to-[#1a2332]/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-shadow-luxury">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            We're here to help you find your dream property or answer any questions
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-8 md:p-12 shadow-xl">
                <h2 className="font-display text-3xl font-bold text-[#1a2332] mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="Rahul Gupta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="rahul@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="+91 0000000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="">Select a subject</option>
                        <option value="buying">Buying Property</option>
                        <option value="selling">Selling Property</option>
                        <option value="investment">Investment Inquiry</option>
                        <option value="consultation">Schedule Consultation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                      placeholder="Tell us about your real estate needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white text-lg py-6"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-8 shadow-xl">
                <h3 className="font-display text-2xl font-bold text-[#1a2332] mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1a2332] mb-1">Main Office</h4>
                      <p className="text-gray-600">
                        26, Harsh Commercial Park,  Garh Road<br />
                        near Vivan Hospital  Meerut Uttar Pradesh, 250004
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1a2332] mb-1">Phone</h4>
                      <a href="tel:+919634396117" className="text-gray-600 hover:text-[#D4AF37]">
                        +91 96343 96117
                      </a> <br />
                      <a href="tel:+918130184250" className="text-gray-600 hover:text-[#D4AF37]">
                        +91 81301 84250
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1a2332] mb-1">Email</h4>
                      <a href="mailto:sales@winstrealtors.com" className="text-gray-600 hover:text-[#D4AF37]">
                        sales@winstrealtors.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1a2332] mb-1">Business Hours</h4>
                      <p className="text-gray-600">
                        Monday - Sunday: 10:00 AM - 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1a2332] to-[#2d3e50] rounded-lg p-8 text-white">
                <h3 className="font-display text-xl font-bold mb-4">
                  Schedule a Consultation
                </h3>
                <p className="text-gray-300 mb-6">
                  Book a private consultation with our luxury real estate experts
                </p>
                <Button
                  asChild
                  className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white"
                >
                  <a href="/v3/consultation">Book Now</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] bg-gray-200">
          <div className="w-full h-full">
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3490.8156366116714!2d77.7446633!3d28.9631923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c6586b5ee5f63%3A0x6213ea614be3dffa!2sInstaa%20Office!5e0!3m2!1sen!2sin!4v1765501679109!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>


      {/* Office Locations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#1a2332] mb-4">
              Our Offices
            </h2>
            <p className="text-xl text-gray-600">
              Visit us at any of our luxury locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-[#fafaf8] rounded-lg p-8 shadow-md">
                <h3 className="font-display text-2xl font-bold text-[#1a2332] mb-4">
                  {office.city}
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-start">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-[#D4AF37]" />
                    {office.address}
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    {office.phone}
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    {office.email}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    {office.hours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
