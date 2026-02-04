"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = "9634396117"; // Replace with actual number
  const message = "Hello, I'm interested in your luxury properties.";

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      {/* Ripple Effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-[pulse-ring_1.5s_cubic-bezier(0.215,0.61,0.355,1)_infinite]"></span>
      
      {/* Main Button */}
      <button
        onClick={handleClick}
        className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group animate-[shake_1.5s_ease-in-out_infinite]"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute right-full mr-3 bg-[#1a2332] text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Chat with us
        </span>
      </button>
    </div>
  );
}