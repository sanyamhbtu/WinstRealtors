import { db } from '@/db';
import { faqs } from '@/db/schema';

async function main() {
    const sampleFaqs = [
        {
            question: 'What is the home buying process?',
            answer: 'The home buying process typically involves several key steps: getting pre-approved for a mortgage, searching for properties that meet your criteria, making an offer, conducting home inspections, finalizing your financing, and closing the deal. Our experienced agents guide you through each stage to ensure a smooth transaction.',
            category: 'Buying',
            orderIndex: 0,
            published: true,
            createdAt: new Date('2024-10-15').toISOString(),
            updatedAt: new Date('2024-10-15').toISOString(),
        },
        {
            question: 'How do I schedule a property viewing?',
            answer: 'You can schedule a property viewing by contacting us directly through our website, calling our office, or sending us an email. We offer flexible viewing times including evenings and weekends. Simply provide your preferred date and time, and we will arrange a personalized tour of the properties you are interested in.',
            category: 'General',
            orderIndex: 1,
            published: true,
            createdAt: new Date('2024-11-01').toISOString(),
            updatedAt: new Date('2024-11-01').toISOString(),
        },
        {
            question: 'What financing options are available for purchasing a property?',
            answer: 'There are various financing options available including conventional mortgages, FHA loans, VA loans for veterans, and USDA loans for rural properties. Additionally, first-time homebuyers may qualify for special programs with lower down payments. We work with trusted lenders who can help you find the best financing solution for your situation.',
            category: 'Financing',
            orderIndex: 2,
            published: true,
            createdAt: new Date('2024-10-20').toISOString(),
            updatedAt: new Date('2024-10-20').toISOString(),
        },
        {
            question: 'How long does it take to sell a property?',
            answer: 'The time it takes to sell a property varies depending on market conditions, location, pricing, and property condition. On average, properties in our market sell within 30-60 days. However, well-priced homes in desirable locations can sell much faster, sometimes within days of listing. We use strategic marketing to attract qualified buyers quickly.',
            category: 'Selling',
            orderIndex: 3,
            published: true,
            createdAt: new Date('2024-11-10').toISOString(),
            updatedAt: new Date('2024-11-10').toISOString(),
        },
        {
            question: 'What documents do I need to buy a house?',
            answer: 'Essential documents for buying a house include proof of identity, proof of income (pay stubs, tax returns), bank statements, employment verification, credit report, and pre-approval letter from your lender. You will also need funds for down payment and closing costs. Our team provides a complete checklist to ensure you have everything needed for a successful purchase.',
            category: 'Buying',
            orderIndex: 4,
            published: true,
            createdAt: new Date('2024-10-25').toISOString(),
            updatedAt: new Date('2024-10-25').toISOString(),
        },
        {
            question: 'How much should I offer for a property?',
            answer: 'Your offer should be based on a comprehensive market analysis, recent comparable sales, property condition, and current market trends. We provide detailed comparative market analysis to help you make a competitive yet fair offer. Factors like seller motivation, time on market, and multiple offer situations also influence the optimal offer price.',
            category: 'Buying',
            orderIndex: 5,
            published: true,
            createdAt: new Date('2024-11-05').toISOString(),
            updatedAt: new Date('2024-11-05').toISOString(),
        },
        {
            question: 'What are closing costs and how much should I expect to pay?',
            answer: 'Closing costs are fees and expenses paid at the closing of a real estate transaction, typically ranging from 2-5% of the purchase price. These costs include appraisal fees, title insurance, attorney fees, loan origination fees, and prepaid property taxes. We provide a detailed estimate of all closing costs early in the process so there are no surprises.',
            category: 'Financing',
            orderIndex: 6,
            published: true,
            createdAt: new Date('2024-10-30').toISOString(),
            updatedAt: new Date('2024-10-30').toISOString(),
        },
        {
            question: 'Do I need a real estate attorney?',
            answer: 'While not required in all states, having a real estate attorney is highly recommended to protect your interests. An attorney reviews contracts, ensures proper title transfer, handles closing documents, and addresses any legal issues that may arise. In some states, attorney involvement is mandatory for real estate transactions to ensure all legal requirements are met.',
            category: 'Legal',
            orderIndex: 7,
            published: true,
            createdAt: new Date('2024-11-08').toISOString(),
            updatedAt: new Date('2024-11-08').toISOString(),
        },
        {
            question: 'How do I prepare my home for sale?',
            answer: 'Preparing your home for sale involves decluttering, deep cleaning, making necessary repairs, and enhancing curb appeal. Consider fresh paint, updated fixtures, professional staging, and high-quality photography. We provide a comprehensive pre-listing checklist and can recommend trusted contractors. Proper preparation can significantly increase your home\'s value and reduce time on market.',
            category: 'Selling',
            orderIndex: 8,
            published: true,
            createdAt: new Date('2024-11-12').toISOString(),
            updatedAt: new Date('2024-11-12').toISOString(),
        },
        {
            question: 'What is the difference between pre-qualification and pre-approval?',
            answer: 'Pre-qualification is an informal estimate of how much you can borrow based on self-reported financial information. Pre-approval is a formal commitment from a lender after verifying your income, credit, and assets. Pre-approval carries more weight with sellers and shows you are a serious buyer. We strongly recommend getting pre-approved before house hunting.',
            category: 'Financing',
            orderIndex: 9,
            published: true,
            createdAt: new Date('2024-11-15').toISOString(),
            updatedAt: new Date('2024-11-15').toISOString(),
        },
    ];

    await db.insert(faqs).values(sampleFaqs);
    
    console.log('✅ FAQs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});