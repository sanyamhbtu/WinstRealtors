"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    if (!res.ok) {
      toast.error("Invalid email or password");
      setLoading(false);
      return;
    }

    const authToken = res.headers.get("auth-token");
    if (authToken) {
      localStorage.setItem("bearer_token", authToken);
    }

    toast.success("Login successful! Redirecting...");

    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") || "/adminstration/admin";

    setTimeout(() => {
      router.push(redirect);
    }, 1000);

  } catch {
    toast.error("An unexpected error occurred");
  }

  setLoading(false);
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    
    <main className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/adminstration" className="flex items-center space-x-3 mb-8">
              <div className="w-25 h-25  rounded flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dxxielg5u/image/upload/v1764957758/winst-removebg-preview_qancvd.png" alt="Winst Logo" />
              </div>
              <span className="font-display text-xl font-bold text-[#1a2332]">
                Winst Realtors
              </span>
            </Link>
            <h1 className="font-display text-4xl font-bold text-[#1a2332] mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
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
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="••••••••"
                  autoComplete="off"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-white py-6 text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#D4AF37] hover:text-[#C4A030] font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div> */}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <Image
          src="https://res.cloudinary.com/dxxielg5u/image/upload/v1765513858/8_twoyxg.jpg"
          alt="Luxury Property"
          fill
          className="object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332]/90 to-[#1a2332]/70" />
        <div className="absolute inset-0 flex items-center justify-center text-white p-12">
          <div className="max-w-lg text-center">
            <h2 className="font-display text-4xl font-bold mb-6">
              Discover Luxury Living
            </h2>
            <p className="text-xl text-gray-200">
              Access exclusive properties and personalized real estate services
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}