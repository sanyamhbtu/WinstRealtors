import { db } from '@/db';
import { galleryItems } from '@/db/schema';

async function main() {
    const sampleGalleryItems = [
        {
            title: 'Oceanfront Villa Living Room',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            category: 'Interior',
            description: 'Elegant living room with panoramic ocean views and modern furnishings',
            orderIndex: 0,
            published: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            title: 'Modern Kitchen Design',
            image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
            category: 'Kitchen',
            description: 'Sleek contemporary kitchen with marble countertops and top-of-the-line appliances',
            orderIndex: 1,
            published: true,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            title: 'Luxury Master Bedroom',
            image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
            category: 'Bedroom',
            description: 'Spacious master suite with walk-in closet and private terrace access',
            orderIndex: 2,
            published: true,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            title: 'Infinity Pool at Sunset',
            image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
            category: 'Pool',
            description: 'Stunning infinity edge pool overlooking the Mediterranean coastline',
            orderIndex: 3,
            published: true,
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        {
            title: 'Contemporary Estate Exterior',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            category: 'Exterior',
            description: 'Modern architectural masterpiece with glass facades and tropical landscaping',
            orderIndex: 4,
            published: true,
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        {
            title: 'Spa-Inspired Master Bath',
            image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
            category: 'Bathroom',
            description: 'Luxurious bathroom featuring rainfall shower, soaking tub, and heated floors',
            orderIndex: 5,
            published: true,
            createdAt: new Date('2024-01-28').toISOString(),
            updatedAt: new Date('2024-01-28').toISOString(),
        },
        {
            title: 'Panoramic City Skyline View',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            category: 'View',
            description: 'Breathtaking penthouse views of the downtown skyline from private balcony',
            orderIndex: 6,
            published: true,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            title: 'Gourmet Chef Kitchen',
            image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
            category: 'Kitchen',
            description: null,
            orderIndex: 7,
            published: true,
            createdAt: new Date('2024-02-03').toISOString(),
            updatedAt: new Date('2024-02-03').toISOString(),
        },
        {
            title: 'Elegant Dining Room',
            image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
            category: 'Interior',
            description: 'Formal dining area with crystal chandelier and seating for twelve guests',
            orderIndex: 8,
            published: false,
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-05').toISOString(),
        },
        {
            title: 'Outdoor Entertainment Area',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            category: 'Exterior',
            description: null,
            orderIndex: 9,
            published: true,
            createdAt: new Date('2024-02-08').toISOString(),
            updatedAt: new Date('2024-02-08').toISOString(),
        },
        {
            title: 'Resort-Style Pool Deck',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
            category: 'Pool',
            description: 'Heated saltwater pool with cabana, outdoor kitchen, and lounge areas',
            orderIndex: 10,
            published: true,
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            title: 'Mountain View Terrace',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
            category: 'View',
            description: 'Expansive outdoor terrace showcasing stunning mountain and valley vistas',
            orderIndex: 11,
            published: true,
            createdAt: new Date('2024-02-12').toISOString(),
            updatedAt: new Date('2024-02-12').toISOString(),
        },
    ];

    await db.insert(galleryItems).values(sampleGalleryItems);
    
    console.log('✅ Gallery items seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});