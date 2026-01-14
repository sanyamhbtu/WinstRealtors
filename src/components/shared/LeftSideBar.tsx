"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LeftSideBar() {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Hide immediately when scrolling
      setVisible(false);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show again when scrolling stops
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
      }, 300); // adjust delay if needed
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`
        fixed left-2 top-1/2 -translate-y-1/2 z-50
        transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
      `}
    >
      {/* Mobile-first vertical long pill */}
      <div
        className="
          flex flex-col items-center gap-5
          rounded-full
          bg-orange-400/90 backdrop-blur-md
          px-2 py-5
          shadow-xl
        "
      >
        <Link
          href="https://www.facebook.com/61583892713142/?http_ref=eyJ0cyI6MTc2NTc0MTAxMDAwMCwiciI6IiJ9"
          target="_blank"
          aria-label="Facebook"
          className="group flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-white transition-all hover:bg-blue-600"
        >
          <Facebook className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
        </Link>

        <Link
          href="https://www.instagram.com/winst_realtors/"
          target="_blank"
          aria-label="Instagram"
          className="group flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-white transition-all hover:bg-pink-600"
        >
          <Instagram className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
        </Link>

        <Link
          href="https://www.linkedin.com/in/winst-realtors-private-limited-b4830a398/"
          target="_blank"
          aria-label="LinkedIn"
          className="group flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-white transition-all hover:bg-blue-700"
        >
          <Linkedin className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
        </Link>

        <Link
          href="https://www.youtube.com/@WinstRealtors"
          target="_blank"
          aria-label="YouTube"
          className="group flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-white transition-all hover:bg-red-600"
        >
          <Youtube className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
        </Link>
      </div>
    </div>
  );
}
