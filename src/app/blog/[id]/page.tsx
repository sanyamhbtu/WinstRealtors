import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  // Mock blog post data
  const post = {
    id: params.id,
    title: "Top 10 Luxury Real Estate Markets for 2024",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/43b9d188-159a-4035-ab5b-2097544eaef3/generated_images/ultra-luxury-modern-mansion-exterior-con-d9c1a564-20251121133418.jpg",
    author: "Victoria Sterling",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    date: "December 15, 2023",
    readTime: "8 min read",
    category: "Market Insights",
    content: `
      <p>The luxury real estate market continues to evolve, with certain markets emerging as particularly attractive for high-net-worth individuals and investors. In this comprehensive analysis, we examine the top luxury real estate markets for 2024 and what makes them stand out.</p>

      <h2>1. Miami, Florida</h2>
      <p>Miami has solidified its position as a premier destination for luxury real estate. With its favorable tax environment, stunning waterfront properties, and vibrant cultural scene, the city continues to attract wealthy buyers from around the world. The influx of tech executives and finance professionals has driven demand for ultra-luxury condominiums and waterfront estates.</p>

      <h2>2. Los Angeles, California</h2>
      <p>The entertainment capital maintains its appeal among celebrities and business moguls. Beverly Hills, Bel Air, and Malibu remain among the most sought-after neighborhoods, with properties commanding premium prices. The combination of perfect weather, ocean views, and proximity to major industries keeps LA at the forefront of luxury real estate.</p>

      <h2>3. New York City</h2>
      <p>Manhattan's luxury market shows resilience with ultra-high-end penthouses and townhouses in prime neighborhoods like Tribeca, SoHo, and the Upper East Side continuing to attract discerning buyers. The city's status as a global financial hub ensures sustained demand for premium properties.</p>

      <h2>4. Dubai, UAE</h2>
      <p>Dubai's luxury real estate market has experienced remarkable growth, offering tax-free living, world-class amenities, and stunning architectural masterpieces. Areas like Palm Jumeirah and Downtown Dubai feature some of the world's most exclusive properties.</p>

      <h2>Investment Outlook</h2>
      <p>These markets demonstrate strong fundamentals including limited supply of prime locations, growing demand from international buyers, and robust economic indicators. Investors should consider factors such as tax implications, rental yields, and long-term appreciation potential when evaluating opportunities.</p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Waterfront properties continue to command premium prices</li>
        <li>Tax-friendly jurisdictions attract high-net-worth individuals</li>
        <li>Limited supply in prime locations supports price stability</li>
        <li>International buyers drive demand in major gateway cities</li>
      </ul>

      <p>The luxury real estate market in 2024 presents compelling opportunities for both primary residences and investment properties. Working with experienced luxury real estate professionals who understand these markets is essential for success.</p>
    `,
  };

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
              href="/blog"
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
                    src={post.authorImage}
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
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-sm font-semibold text-gray-600">Share:</span>
              <button className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <Facebook className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <Twitter className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <Linkedin className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-[#1a2332] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1a2332] prose-ul:text-gray-600 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">Tags:</span>
                {["Luxury Real Estate", "Market Analysis", "Investment", "2024 Trends"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-[#D4AF37] hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-[#fafaf8] rounded-b-2xl shadow-xl p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-bold text-[#1a2332] mb-2">
                  About {post.author}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Victoria Sterling is the CEO and Founder of Winst Realtors with over 25 years of experience in luxury real estate. She specializes in high-end residential properties and has been featured in Forbes, WSJ, and Bloomberg for her market insights.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                >
                  <Link href="/about">View Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-[#1a2332] mb-8">
            Related Articles
          </h2>
          <p className="text-gray-600 mb-4">Related articles would be displayed here based on category and tags</p>
        </div>
      </section>
    </main>
  );
}
