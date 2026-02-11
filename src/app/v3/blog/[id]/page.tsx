"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: "Market Insights" | "Investment" | "Technology" | "Lifestyle" | "Legal" | "Design";
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Mock blog post data
  const [post,setPost] = useState<Blog | null>(null);
  const {id} = React.use(params);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog-posts?id=${id}`)
        
        if (!res.ok) {
          toast.error("Blog not found");
          return;
        }

        const data = await res.json();

        setPost(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog details");
      }
    }
    fetchBlog();
  }, [id])
  if (!post) {
    return (
      <div className="min-h-screen pt-20 bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-[#1a2332] mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The Blog you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
            <Link href="/v3/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Image */}
      <div className="relative h-[60vh]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="relative -mt-32 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-t-2xl shadow-2xl p-8 md:p-12">
            {/* Breadcrumb */}
            <Link
              href="/v3/blog"
              className="inline-flex items-center text-[#D4AF37] hover:text-[#C4A030] mb-6 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Category */}
            <span className="inline-block bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1a2332] mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post.authorImage || "https://res.cloudinary.com/dxxielg5u/image/upload/v1764976331/avatar_lg2vgt.jpg"}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#1a2332]">{post.author}</p>
                  <p className="text-sm text-gray-500">Senior Analyst</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-[#1a2332] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1a2332] prose-ul:text-gray-600 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            
          </div>

          {/* Author Bio */}
          
        </div>
      </article>

      {/* Related Posts */}
      
    </main>
  );
}
