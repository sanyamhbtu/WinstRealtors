"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle2, ArrowRight, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import LeftSideBar from "@/components/shared/LeftSideBar";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const indianLocations = [
  // Andhra Pradesh
  { value: "Visakhapatnam, Andhra Pradesh", label: "Visakhapatnam, Andhra Pradesh" },
  { value: "Vijayawada, Andhra Pradesh", label: "Vijayawada, Andhra Pradesh" },
  { value: "Guntur, Andhra Pradesh", label: "Guntur, Andhra Pradesh" },
  { value: "Nellore, Andhra Pradesh", label: "Nellore, Andhra Pradesh" },
  { value: "Kurnool, Andhra Pradesh", label: "Kurnool, Andhra Pradesh" },

  // Assam
  { value: "Guwahati, Assam", label: "Guwahati, Assam" },
  { value: "Silchar, Assam", label: "Silchar, Assam" },

  // Bihar
  { value: "Patna, Bihar", label: "Patna, Bihar" },
  { value: "Gaya, Bihar", label: "Gaya, Bihar" },
  { value: "Muzaffarpur, Bihar", label: "Muzaffarpur, Bihar" },

  // Chhattisgarh
  { value: "Raipur, Chhattisgarh", label: "Raipur, Chhattisgarh" },
  { value: "Bhilai, Chhattisgarh", label: "Bhilai, Chhattisgarh" },

  // Chandigarh
  { value: "Chandigarh", label: "Chandigarh" },

  // Delhi NCR
  { value: "Delhi, Delhi", label: "Delhi, Delhi" },
  { value: "New Delhi, Delhi", label: "New Delhi, Delhi" },

  // Goa
  { value: "Panaji, Goa", label: "Panaji, Goa" },
  { value: "Vasco da Gama, Goa", label: "Vasco da Gama, Goa" },

  // Gujarat
  { value: "Ahmedabad, Gujarat", label: "Ahmedabad, Gujarat" },
  { value: "Surat, Gujarat", label: "Surat, Gujarat" },
  { value: "Vadodara, Gujarat", label: "Vadodara, Gujarat" },
  { value: "Rajkot, Gujarat", label: "Rajkot, Gujarat" },
  { value: "Gandhinagar, Gujarat", label: "Gandhinagar, Gujarat" },
  
  // Haryana
  { value: "Gurgaon, Haryana", label: "Gurgaon, Haryana" },
  { value: "Faridabad, Haryana", label: "Faridabad, Haryana" },
  { value: "Panipat, Haryana", label: "Panipat, Haryana" },

  // Himachal Pradesh
  { value: "Shimla, Himachal Pradesh", label: "Shimla, Himachal Pradesh" },
  { value: "Manali, Himachal Pradesh", label: "Manali, Himachal Pradesh" },

  // Jharkhand
  { value: "Ranchi, Jharkhand", label: "Ranchi, Jharkhand" },
  { value: "Jamshedpur, Jharkhand", label: "Jamshedpur, Jharkhand" },
  { value: "Dhanbad, Jharkhand", label: "Dhanbad, Jharkhand" },

  // Karnataka
  { value: "Bangalore, Karnataka", label: "Bangalore, Karnataka" },
  { value: "Mysore, Karnataka", label: "Mysore, Karnataka" },
  { value: "Hubli-Dharwad, Karnataka", label: "Hubli-Dharwad, Karnataka" },
  { value: "Mangalore, Karnataka", label: "Mangalore, Karnataka" },
  { value: "Belgaum, Karnataka", label: "Belgaum, Karnataka" },

  // Kerala
  { value: "Thiruvananthapuram, Kerala", label: "Thiruvananthapuram, Kerala" },
  { value: "Kochi, Kerala", label: "Kochi, Kerala" },
  { value: "Kozhikode, Kerala", label: "Kozhikode, Kerala" },
  { value: "Thrissur, Kerala", label: "Thrissur, Kerala" },

  // Madhya Pradesh
  { value: "Indore, Madhya Pradesh", label: "Indore, Madhya Pradesh" },
  { value: "Bhopal, Madhya Pradesh", label: "Bhopal, Madhya Pradesh" },
  { value: "Jabalpur, Madhya Pradesh", label: "Jabalpur, Madhya Pradesh" },
  { value: "Gwalior, Madhya Pradesh", label: "Gwalior, Madhya Pradesh" },

  // Maharashtra
  { value: "Mumbai, Maharashtra", label: "Mumbai, Maharashtra" },
  { value: "Pune, Maharashtra", label: "Pune, Maharashtra" },
  { value: "Nagpur, Maharashtra", label: "Nagpur, Maharashtra" },
  { value: "Nashik, Maharashtra", label: "Nashik, Maharashtra" },
  { value: "Thane, Maharashtra", label: "Thane, Maharashtra" },
  { value: "Aurangabad, Maharashtra", label: "Aurangabad, Maharashtra" },
  { value: "Solapur, Maharashtra", label: "Solapur, Maharashtra" },

  // Odisha
  { value: "Bhubaneswar, Odisha", label: "Bhubaneswar, Odisha" },
  { value: "Cuttack, Odisha", label: "Cuttack, Odisha" },
  { value: "Rourkela, Odisha", label: "Rourkela, Odisha" },

  // Punjab
  { value: "Ludhiana, Punjab", label: "Ludhiana, Punjab" },
  { value: "Amritsar, Punjab", label: "Amritsar, Punjab" },
  { value: "Jalandhar, Punjab", label: "Jalandhar, Punjab" },
  { value: "Mohali, Punjab", label: "Mohali, Punjab" },

  // Rajasthan
  { value: "Jaipur, Rajasthan", label: "Jaipur, Rajasthan" },
  { value: "Jodhpur, Rajasthan", label: "Jodhpur, Rajasthan" },
  { value: "Udaipur, Rajasthan", label: "Udaipur, Rajasthan" },
  { value: "Kota, Rajasthan", label: "Kota, Rajasthan" },

  // Tamil Nadu
  { value: "Chennai, Tamil Nadu", label: "Chennai, Tamil Nadu" },
  { value: "Coimbatore, Tamil Nadu", label: "Coimbatore, Tamil Nadu" },
  { value: "Madurai, Tamil Nadu", label: "Madurai, Tamil Nadu" },
  { value: "Tiruchirappalli, Tamil Nadu", label: "Tiruchirappalli, Tamil Nadu" },
  { value: "Salem, Tamil Nadu", label: "Salem, Tamil Nadu" },

  // Telangana
  { value: "Hyderabad, Telangana", label: "Hyderabad, Telangana" },
  { value: "Warangal, Telangana", label: "Warangal, Telangana" },

  // Uttar Pradesh
  { value: "Lucknow, Uttar Pradesh", label: "Lucknow, Uttar Pradesh" },
  { value: "Kanpur, Uttar Pradesh", label: "Kanpur, Uttar Pradesh" },
  { value: "Agra, Uttar Pradesh", label: "Agra, Uttar Pradesh" },
  { value: "Varanasi, Uttar Pradesh", label: "Varanasi, Uttar Pradesh" },
  { value: "Noida, Uttar Pradesh", label: "Noida, Uttar Pradesh" },
  { value: "Ghaziabad, Uttar Pradesh", label: "Ghaziabad, Uttar Pradesh" },
  { value: "Meerut, Uttar Pradesh", label: "Meerut, Uttar Pradesh" },
  { value: "Prayagraj, Uttar Pradesh", label: "Prayagraj, Uttar Pradesh" },

  // Uttarakhand
  { value: "Dehradun, Uttarakhand", label: "Dehradun, Uttarakhand" },
  { value: "Haridwar, Uttarakhand", label: "Haridwar, Uttarakhand" },
  { value: "Roorkee, Uttarakhand", label: "Roorkee, Uttarakhand" },

  // West Bengal
  { value: "Kolkata, West Bengal", label: "Kolkata, West Bengal" },
  { value: "Asansol, West Bengal", label: "Asansol, West Bengal" },
  { value: "Siliguri, West Bengal", label: "Siliguri, West Bengal" },
  { value: "Durgapur, West Bengal", label: "Durgapur, West Bengal" },

  // States
  { value: "Andhra Pradesh", label: "Andhra Pradesh (State)" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh (State)" },
  { value: "Assam", label: "Assam (State)" },
  { value: "Bihar", label: "Bihar (State)" },
  { value: "Chhattisgarh", label: "Chhattisgarh (State)" },
  { value: "Goa", label: "Goa (State)" },
  { value: "Gujarat", label: "Gujarat (State)" },
  { value: "Haryana", label: "Haryana (State)" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh (State)" },
  { value: "Jharkhand", label: "Jharkhand (State)" },
  { value: "Karnataka", label: "Karnataka (State)" },
  { value: "Kerala", label: "Kerala (State)" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh (State)" },
  { value: "Maharashtra", label: "Maharashtra (State)" },
  { value: "Manipur", label: "Manipur (State)" },
  { value: "Meghalaya", label: "Meghalaya (State)" },
  { value: "Mizoram", label: "Mizoram (State)" },
  { value: "Nagaland", label: "Nagaland (State)" },
  { value: "Odisha", label: "Odisha (State)" },
  { value: "Punjab", label: "Punjab (State)" },
  { value: "Rajasthan", label: "Rajasthan (State)" },
  { value: "Sikkim", label: "Sikkim (State)" },
  { value: "Tamil Nadu", label: "Tamil Nadu (State)" },
  { value: "Telangana", label: "Telangana (State)" },
  { value: "Tripura", label: "Tripura (State)" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh (State)" },
  { value: "Uttarakhand", label: "Uttarakhand (State)" },
  { value: "West Bengal", label: "West Bengal (State)" },
];
export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    location: "",
    date: "",
    time: "",
    message: "",
  });

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          propertyType: formData.propertyType,
          budget: formData.budget,
          location: formData.location,
          message: formData.message,
          status: "Pending",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to book consultation");
      }

      const booking = await response.json();
      console.log("Consultation booked:", booking);
      toast.success("Consultation booked successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to book consultation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (isSubmitted) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center bg-[#fafaf8]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-[#1a2332] mb-4">
              Consultation Booked Successfully!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thank you for scheduling a consultation with Winst Realtors. We've sent a confirmation email to {formData.email}. 
              One of our luxury real estate experts will contact you shortly to confirm your appointment.
            </p>
            <div className="bg-[#fafaf8] rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-[#1a2332] mb-4">Appointment Details:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Date:</strong> {formData.date}</p>
                <p><strong>Time:</strong> {formData.time}</p>
                <p><strong>Contact:</strong> {formData.email}</p>
                {formData.propertyType && <p><strong>Property Type:</strong> {formData.propertyType}</p>}
                {formData.budget && <p><strong>Budget:</strong> {formData.budget}</p>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-[#D4AF37] hover:bg-[#C4A030] text-white"
              >
                <Link href="/">Return Home</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-white"
              >
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dxxielg5u/image/upload/v1765513248/7_si8hlm.jpg"
            alt="Book Consultation"
            fill
            className="object-fill"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 to-[#1a2332]/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-shadow-luxury">
            Book a Consultation
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            Schedule a private meeting with our luxury real estate experts
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? "bg-[#D4AF37] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step > s ? "bg-[#D4AF37]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600 max-w-md mx-auto">
              <span className={step >= 1 ? "text-[#D4AF37] font-semibold" : ""}>
                Your Info
              </span>
              <span className={step >= 2 ? "text-[#D4AF37] font-semibold" : ""}>
                Property Details
              </span>
              <span className={step >= 3 ? "text-[#D4AF37] font-semibold" : ""}>
                Schedule
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display text-3xl font-bold text-[#1a2332] mb-6">
                    Your Information
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white py-6 text-lg"
                  >
                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display text-3xl font-bold text-[#1a2332] mb-6">
                    Property Details
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      name="propertyType"
                      required
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">Select property type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="villa">Villa</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="estate">Estate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range *
                    </label>
                    <select
                      name="budget"
                      required
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">Select budget range</option>
                      <option value="$0 - $5M">$0 - $5M</option>
                      <option value="$5M - $10M">$5M - $10M</option>
                      <option value="$10M - $20M">$10M - $20M</option>
                      <option value="$20M+">$20M+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Location *
                    </label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between px-4 py-6 border-gray-300 text-base font-normal hover:bg-white hover:text-black",
                            !formData.location && "text-muted-foreground"
                          )}
                        >
                          {formData.location
                            ? indianLocations.find((loc) => loc.value === formData.location)?.label || formData.location
                            : "Select city or state..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search location..." />
                          <CommandList>
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto">
                              {indianLocations.map((loc) => (
                                <CommandItem
                                  key={loc.value}
                                  value={loc.label} // Use label for searching
                                  onSelect={(currentValue: string) => {
                                    // currentValue is lowercase label from cmdk
                                    // Find exact match or use current value
                                    const match = indianLocations.find(l => l.label.toLowerCase() === currentValue.toLowerCase());
                                    setFormData({
                                      ...formData,
                                      location: match ? match.value : currentValue
                                    });
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.location === loc.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {loc.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                        placeholder="Tell us more about what you're looking for..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-[#D4AF37] hover:bg-[#C4A030] text-white py-6 text-lg"
                    >
                      Continue <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display text-3xl font-bold text-[#1a2332] mb-6">
                    Schedule Your Consultation
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="">Select time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#fafaf8] rounded-lg p-6 mt-6">
                    <h3 className="font-semibold text-[#1a2332] mb-4">Review Your Information</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Name:</strong> {formData.name}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                      <p><strong>Property Type:</strong> {formData.propertyType}</p>
                      <p><strong>Budget:</strong> {formData.budget}</p>
                      <p><strong>Location:</strong> {formData.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#D4AF37] hover:bg-[#C4A030] text-white py-6 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1a2332] mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600">Choose a time that works best for you</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1a2332] mb-2">Expert Advisors</h3>
              <p className="text-sm text-gray-600">Meet with experienced real estate professionals</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1a2332] mb-2">No Obligation</h3>
              <p className="text-sm text-gray-600">Free consultation with no commitment</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}