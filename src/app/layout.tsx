import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Winst Realtors - Luxury Real Estate | Premium Properties",
  description: "Discover exceptional luxury properties with Winst Realtors. Specializing in high-end residential and commercial real estate worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="smooth-scroll">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          id="suppress-extension-errors"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.filename && e.filename.includes('chrome-extension://')) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  return false;
                }
              }, true);
              
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.stack && e.reason.stack.includes('chrome-extension://')) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  return false;
                }
              }, true);
            `
          }}
        />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Navigation />
        {children}
        <Footer />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}