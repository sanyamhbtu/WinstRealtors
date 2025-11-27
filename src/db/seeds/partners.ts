import { db } from '@/db';
import { partners } from '@/db/schema';

async function main() {
    const samplePartners = [
        {
            name: 'Luxury Home Mortgage',
            logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Luxury+Home+Mortgage',
            website: 'https://luxuryhomemortgage.com',
            createdAt: new Date('2024-02-15').toISOString(),
            updatedAt: new Date('2024-02-15').toISOString(),
        },
        {
            name: 'Elite Property Insurance',
            logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Elite+Property+Insurance',
            website: 'https://eliteproperty.com',
            createdAt: new Date('2024-03-10').toISOString(),
            updatedAt: new Date('2024-03-10').toISOString(),
        },
        {
            name: 'Premier Title Services',
            logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Premier+Title+Services',
            website: 'https://premiertitleservices.com',
            createdAt: new Date('2024-04-05').toISOString(),
            updatedAt: new Date('2024-04-05').toISOString(),
        },
        {
            name: 'Signature Interior Design',
            logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Signature+Interior+Design',
            website: 'https://signatureinteriors.com',
            createdAt: new Date('2024-05-20').toISOString(),
            updatedAt: new Date('2024-05-20').toISOString(),
        },
        {
            name: 'First National Bank',
            logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=First+National+Bank',
            website: 'https://firstnationalbank.com',
            createdAt: new Date('2024-06-12').toISOString(),
            updatedAt: new Date('2024-06-12').toISOString(),
        },
        {
            name: 'Prestige Home Inspections',
            logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Prestige+Home+Inspections',
            website: 'https://prestigehomeinspections.com',
            createdAt: new Date('2024-07-08').toISOString(),
            updatedAt: new Date('2024-07-08').toISOString(),
        },
        {
            name: 'Summit Real Estate Law Group',
            logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Summit+Law+Group',
            website: 'https://summitrelaw.com',
            createdAt: new Date('2024-08-22').toISOString(),
            updatedAt: new Date('2024-08-22').toISOString(),
        }
    ];

    await db.insert(partners).values(samplePartners);
    
    console.log('✅ Partners seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});