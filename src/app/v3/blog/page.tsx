"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  published?: boolean;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  const categories = ["All Posts", "Market Insights", "Investment", "Technology", "Lifestyle", "Legal", "Design"];

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog-posts?limit=100");
        if (res.ok) {
          const data = await res.json();
          // Transform API data
          const transformedData = data
            .filter((post: any) => post.published) // Only show published posts
            .map((post: any) => ({
              id: post.id.toString(),
              title: post.title,
              excerpt: post.excerpt || "",
              image: post.image || "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/ultra-luxury-modern-mansion-exterior-con-d9c1a564-20251121133418.jpg",
              author: post.author,
              date: post.date || new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
              readTime: post.readTime || "5 min read",
              category: post.category,
              published: post.published,
            }));
          setBlogPosts(transformedData);
        } else {
          toast.error("Failed to load blog posts");
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast.error("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const filteredPosts = selectedCategory === "All Posts"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a2332] to-[#2d3e50] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Insights & News
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Expert insights, market trends, and luxury real estate news from industry leaders
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-[#D4AF37] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="py-20 bg-[#fafaf8]">
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
          </div>
        </section>
      ) : filteredPosts.length === 0 ? (
        <section className="py-20 bg-[#fafaf8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xl text-gray-600">No blog posts found</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-12 bg-[#fafaf8]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-96 lg:h-auto">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <span className="text-[#D4AF37] font-semibold mb-3">
                        {featuredPost.category}
                      </span>
                      <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1a2332] mb-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-6 space-x-6">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="bg-[#D4AF37] hover:bg-[#C4A030] text-white w-fit"
                      >
                        <Link href={`/v3/blog/${featuredPost.id}`}>
                          Read Article <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Blog Grid */}
          {otherPosts.length > 0 && (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group bg-[#fafaf8] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#1a2332] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-xl font-bold text-[#1a2332] mb-3 group-hover:text-[#D4AF37] transition-colors">
                          <Link href={`/v3/blog/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <Link
                          href={`/v3/blog/${post.id}`}
                          className="text-[#D4AF37] font-semibold text-sm hover:underline inline-flex items-center"
                        >
                          Read More <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12 space-x-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button className="bg-[#D4AF37] hover:bg-[#C4A030] text-white">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter */}
      <section className="py-20 luxury-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-bold mb-6">
            Stay Informed
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest luxury real estate insights and market updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg text-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <Button className="bg-[#D4AF37] hover:bg-[#C4A030] text-white px-8 py-4">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}