import { db } from '@/db';
import { testimonials } from '@/db/schema';

async function main() {
    const sampleTestimonials = [
        {
            name: 'Jennifer Williams',
            role: 'CEO, Tech Startup',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            content: 'Working with this team made finding my dream home effortless. Their attention to detail and market knowledge is exceptional. I couldn\'t be happier with the entire experience!',
            rating: 5,
            createdAt: new Date('2024-08-15').toISOString(),
            updatedAt: new Date('2024-08-15').toISOString(),
        },
        {
            name: 'Robert Martinez',
            role: 'Real Estate Investor',
            image: 'https://randomuser.me/api/portraits/men/2.jpg',
            content: 'As an investor, I appreciate their professionalism and market insights. They helped me identify lucrative opportunities and navigate complex negotiations with ease.',
            rating: 5,
            createdAt: new Date('2024-09-10').toISOString(),
            updatedAt: new Date('2024-09-10').toISOString(),
        },
        {
            name: 'Amanda Chen',
            role: 'Business Owner',
            image: 'https://randomuser.me/api/portraits/women/3.jpg',
            content: 'The dedication and personalized service I received was outstanding. They understood exactly what I was looking for and delivered beyond my expectations.',
            rating: 5,
            createdAt: new Date('2024-10-05').toISOString(),
            updatedAt: new Date('2024-10-05').toISOString(),
        },
        {
            name: 'Thomas Anderson',
            role: 'Corporate Executive',
            image: 'https://randomuser.me/api/portraits/men/4.jpg',
            content: 'From start to finish, the process was seamless. Their expertise in luxury properties and commitment to excellence truly sets them apart in the industry.',
            rating: 5,
            createdAt: new Date('2024-11-12').toISOString(),
            updatedAt: new Date('2024-11-12').toISOString(),
        },
        {
            name: 'Sarah Thompson',
            role: 'Entrepreneur',
            image: 'https://randomuser.me/api/portraits/women/5.jpg',
            content: 'Their market knowledge and negotiation skills saved me both time and money. Professional, responsive, and genuinely committed to finding the perfect property.',
            rating: 4,
            createdAt: new Date('2024-11-20').toISOString(),
            updatedAt: new Date('2024-11-20').toISOString(),
        },
        {
            name: 'Michael Rodriguez',
            role: 'Financial Advisor',
            image: 'https://randomuser.me/api/portraits/men/6.jpg',
            content: 'Exceptional service from a team that truly understands luxury real estate. They made what could have been stressful into an enjoyable and rewarding experience.',
            rating: 5,
            createdAt: new Date('2024-12-01').toISOString(),
            updatedAt: new Date('2024-12-01').toISOString(),
        },
        {
            name: 'Emily Parker',
            role: 'Marketing Director',
            image: 'https://randomuser.me/api/portraits/women/7.jpg',
            content: 'Their attention to detail and understanding of my needs was remarkable. They went above and beyond to ensure I found the perfect home for my family.',
            rating: 5,
            createdAt: new Date('2024-12-15').toISOString(),
            updatedAt: new Date('2024-12-15').toISOString(),
        },
        {
            name: 'David Kim',
            role: 'Software Engineer',
            image: 'https://randomuser.me/api/portraits/men/8.jpg',
            content: 'Great experience overall. They were responsive and knowledgeable, making the home buying process much smoother than I anticipated. Highly recommend their services.',
            rating: 4,
            createdAt: new Date('2024-12-28').toISOString(),
            updatedAt: new Date('2024-12-28').toISOString(),
        }
    ];

    await db.insert(testimonials).values(sampleTestimonials);
    
    console.log('✅ Testimonials seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});