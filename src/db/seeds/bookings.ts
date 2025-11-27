import { db } from '@/db';
import { bookings } from '@/db/schema';

async function main() {
    const sampleBookings = [
        {
            name: 'Michael Johnson',
            email: 'michael.j@email.com',
            phone: '+1 (555) 123-4567',
            date: '2024-03-20',
            time: '10:00 AM',
            status: 'Confirmed',
            notes: 'Interested in the penthouse unit',
            createdAt: new Date('2024-03-10T09:30:00').toISOString(),
            updatedAt: new Date('2024-03-11T14:20:00').toISOString(),
        },
        {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@company.com',
            phone: '+1 (555) 234-5678',
            date: '2024-03-18',
            time: '2:30 PM',
            status: 'Confirmed',
            notes: 'First-time buyer, needs financing information',
            createdAt: new Date('2024-03-08T11:15:00').toISOString(),
            updatedAt: new Date('2024-03-08T11:15:00').toISOString(),
        },
        {
            name: 'James Brown',
            email: 'james.brown@outlook.com',
            phone: '+1 (555) 345-6789',
            date: '2024-03-22',
            time: '4:00 PM',
            status: 'Pending',
            notes: null,
            createdAt: new Date('2024-03-12T16:45:00').toISOString(),
            updatedAt: new Date('2024-03-12T16:45:00').toISOString(),
        },
        {
            name: 'Sarah Williams',
            email: 'sarah.w@gmail.com',
            phone: '+1 (555) 456-7890',
            date: '2024-03-15',
            time: '11:30 AM',
            status: 'Completed',
            notes: 'Looking for investment property in downtown area',
            createdAt: new Date('2024-03-05T10:20:00').toISOString(),
            updatedAt: new Date('2024-03-15T12:00:00').toISOString(),
        },
        {
            name: 'David Martinez',
            email: 'david.martinez@business.com',
            phone: '+1 (555) 567-8901',
            date: '2024-03-25',
            time: '9:00 AM',
            status: 'Pending',
            notes: 'Relocating from California, needs quick viewing',
            createdAt: new Date('2024-03-13T08:30:00').toISOString(),
            updatedAt: new Date('2024-03-13T08:30:00').toISOString(),
        },
        {
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '+1 (555) 678-9012',
            date: '2024-03-19',
            time: '3:00 PM',
            status: 'Confirmed',
            notes: null,
            createdAt: new Date('2024-03-09T13:40:00').toISOString(),
            updatedAt: new Date('2024-03-10T09:15:00').toISOString(),
        },
        {
            name: 'Robert Wilson',
            email: 'robert.wilson@corporate.com',
            phone: '+1 (555) 789-0123',
            date: '2024-03-21',
            time: '1:00 PM',
            status: 'Pending',
            notes: null,
            createdAt: new Date('2024-03-11T15:25:00').toISOString(),
            updatedAt: new Date('2024-03-11T15:25:00').toISOString(),
        },
        {
            name: 'Jennifer Taylor',
            email: 'jennifer.t@mail.com',
            phone: '+1 (555) 890-1234',
            date: '2024-03-14',
            time: '10:30 AM',
            status: 'Cancelled',
            notes: 'Schedule conflict, will reschedule later',
            createdAt: new Date('2024-03-04T12:00:00').toISOString(),
            updatedAt: new Date('2024-03-13T18:30:00').toISOString(),
        },
        {
            name: 'Christopher Lee',
            email: 'chris.lee@company.com',
            phone: '+1 (555) 901-2345',
            date: '2024-03-23',
            time: '2:00 PM',
            status: 'Confirmed',
            notes: 'Interested in properties with home office space',
            createdAt: new Date('2024-03-12T10:10:00').toISOString(),
            updatedAt: new Date('2024-03-13T11:45:00').toISOString(),
        },
        {
            name: 'Amanda Thompson',
            email: 'amanda.thompson@email.com',
            phone: '+1 (555) 012-3456',
            date: '2024-03-16',
            time: '5:00 PM',
            status: 'Completed',
            notes: null,
            createdAt: new Date('2024-03-06T14:30:00').toISOString(),
            updatedAt: new Date('2024-03-16T17:20:00').toISOString(),
        },
    ];

    await db.insert(bookings).values(sampleBookings);
    
    console.log('✅ Bookings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});