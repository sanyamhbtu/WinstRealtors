import { db } from '@/db';
import { contacts } from '@/db/schema';

async function main() {
    const sampleContacts = [
        {
            name: 'David Lee',
            email: 'david.lee@email.com',
            phone: '+1 (555) 234-5678',
            subject: 'Property Inquiry - Malibu Estate',
            message: 'I am very interested in the Malibu beachfront estate listed on your website. Could we schedule a viewing this weekend? I would also like to discuss financing options.',
            status: 'Unread',
            createdAt: new Date('2024-01-22T14:30:00').toISOString(),
            updatedAt: new Date('2024-01-22T14:30:00').toISOString(),
        },
        {
            name: 'Maria Garcia',
            email: 'maria.g@company.com',
            phone: '+1 (555) 876-5432',
            subject: 'Schedule Viewing',
            message: 'I would like to schedule a viewing for the luxury penthouse in downtown. Please contact me at your earliest convenience to arrange a suitable time.',
            status: 'Read',
            createdAt: new Date('2024-01-21T10:15:00').toISOString(),
            updatedAt: new Date('2024-01-21T16:45:00').toISOString(),
        },
        {
            name: 'Kevin White',
            email: 'kevin.white@investments.com',
            phone: '+1 (555) 345-6789',
            subject: 'Investment Opportunity',
            message: 'I represent a group of investors interested in premium real estate opportunities. We would like to discuss potential properties in the $2-5M range. Please call me to set up a meeting.',
            status: 'Responded',
            createdAt: new Date('2024-01-20T09:00:00').toISOString(),
            updatedAt: new Date('2024-01-20T15:30:00').toISOString(),
        },
        {
            name: 'Sarah Johnson',
            email: 'sarah.j@techcorp.com',
            phone: '+1 (555) 123-4567',
            subject: 'Price Information',
            message: 'Could you provide more detailed pricing information for the lakefront property? I am also interested in knowing about any upcoming open houses or virtual tours available.',
            status: 'Unread',
            createdAt: new Date('2024-01-21T16:20:00').toISOString(),
            updatedAt: new Date('2024-01-21T16:20:00').toISOString(),
        },
        {
            name: 'Michael Chen',
            email: 'mchen@globalventures.com',
            phone: '+1 (555) 987-6543',
            subject: 'Investment Portfolio Inquiry',
            message: 'I am looking to expand my real estate portfolio and your luxury properties caught my attention. I would appreciate receiving information about all available high-end listings.',
            status: 'Unread',
            createdAt: new Date('2024-01-22T11:00:00').toISOString(),
            updatedAt: new Date('2024-01-22T11:00:00').toISOString(),
        },
        {
            name: 'Jennifer Martinez',
            email: 'jennifer.martinez@outlook.com',
            phone: '+1 (555) 456-7890',
            subject: 'Property Details Request',
            message: 'I saw your listing for the mountain retreat property. Can you provide more details about the property condition and recent renovations? Also interested in the neighborhood amenities.',
            status: 'Read',
            createdAt: new Date('2024-01-19T13:45:00').toISOString(),
            updatedAt: new Date('2024-01-20T09:15:00').toISOString(),
        },
        {
            name: 'Robert Thompson',
            email: 'r.thompson@privequity.com',
            phone: '+1 (555) 654-3210',
            subject: 'Urgent Viewing Request',
            message: 'I am relocating to the area next month and need to secure a property quickly. I am interested in viewing several of your listings. Please contact me as soon as possible.',
            status: 'Responded',
            createdAt: new Date('2024-01-20T15:30:00').toISOString(),
            updatedAt: new Date('2024-01-21T10:00:00').toISOString(),
        },
        {
            name: 'Emily Davis',
            email: 'emily.davis@consultant.com',
            phone: '+1 (555) 321-0987',
            subject: 'General Inquiry',
            message: 'I am interested in learning more about your services and the types of properties you specialize in. Do you offer property management services as well?',
            status: 'Unread',
            createdAt: new Date('2024-01-22T08:45:00').toISOString(),
            updatedAt: new Date('2024-01-22T08:45:00').toISOString(),
        },
        {
            name: 'Daniel Brown',
            email: 'daniel.b@realestate.com',
            phone: '+1 (555) 789-0123',
            subject: 'Partnership Opportunity',
            message: 'I work with high-net-worth clients looking for luxury properties. I would like to discuss a potential partnership to show your listings to my clients. Looking forward to connecting.',
            status: 'Read',
            createdAt: new Date('2024-01-19T10:00:00').toISOString(),
            updatedAt: new Date('2024-01-19T14:30:00').toISOString(),
        },
    ];

    await db.insert(contacts).values(sampleContacts);
    
    console.log('✅ Contacts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});