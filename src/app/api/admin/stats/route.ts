import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, blogPosts, testimonials, partners, bookings, contacts, faqs, galleryItems } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    // Execute all count queries in parallel for better performance
    const [
      totalPropertiesResult,
      activePropertiesResult,
      featuredPropertiesResult,
      totalBlogPostsResult,
      publishedBlogPostsResult,
      totalTestimonialsResult,
      totalPartnersResult,
      totalBookingsResult,
      pendingBookingsResult,
      confirmedBookingsResult,
      totalContactsResult,
      unreadContactsResult,
      totalFaqsResult,
      publishedFaqsResult,
      totalGalleryItemsResult,
      publishedGalleryItemsResult,
    ] = await Promise.all([
      // Properties counts
      db.select({ count: count() }).from(properties),
      db.select({ count: count() }).from(properties).where(eq(properties.status, 'Active')),
      db.select({ count: count() }).from(properties).where(eq(properties.featured, true)),
      
      // Blog posts counts
      db.select({ count: count() }).from(blogPosts),
      db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.published, true)),
      
      // Testimonials count
      db.select({ count: count() }).from(testimonials),
      
      // Partners count
      db.select({ count: count() }).from(partners),
      
      // Bookings counts
      db.select({ count: count() }).from(bookings),
      db.select({ count: count() }).from(bookings).where(eq(bookings.status, 'Pending')),
      db.select({ count: count() }).from(bookings).where(eq(bookings.status, 'Confirmed')),
      
      // Contacts counts
      db.select({ count: count() }).from(contacts),
      db.select({ count: count() }).from(contacts).where(eq(contacts.status, 'Unread')),
      
      // FAQs counts
      db.select({ count: count() }).from(faqs),
      db.select({ count: count() }).from(faqs).where(eq(faqs.published, true)),
      
      // Gallery items counts
      db.select({ count: count() }).from(galleryItems),
      db.select({ count: count() }).from(galleryItems).where(eq(galleryItems.published, true)),
    ]);

    // Construct the statistics response object
    const statistics = {
      totalProperties: totalPropertiesResult[0]?.count ?? 0,
      activeProperties: activePropertiesResult[0]?.count ?? 0,
      featuredProperties: featuredPropertiesResult[0]?.count ?? 0,
      totalBlogPosts: totalBlogPostsResult[0]?.count ?? 0,
      publishedBlogPosts: publishedBlogPostsResult[0]?.count ?? 0,
      totalTestimonials: totalTestimonialsResult[0]?.count ?? 0,
      totalPartners: totalPartnersResult[0]?.count ?? 0,
      totalBookings: totalBookingsResult[0]?.count ?? 0,
      pendingBookings: pendingBookingsResult[0]?.count ?? 0,
      confirmedBookings: confirmedBookingsResult[0]?.count ?? 0,
      totalContacts: totalContactsResult[0]?.count ?? 0,
      unreadContacts: unreadContactsResult[0]?.count ?? 0,
      totalFaqs: totalFaqsResult[0]?.count ?? 0,
      publishedFaqs: publishedFaqsResult[0]?.count ?? 0,
      totalGalleryItems: totalGalleryItemsResult[0]?.count ?? 0,
      publishedGalleryItems: publishedGalleryItemsResult[0]?.count ?? 0,
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error('GET dashboard statistics error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'STATISTICS_FETCH_ERROR'
      },
      { status: 500 }
    );
  }
}