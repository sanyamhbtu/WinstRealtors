import { db } from '@/db';
import { blogPosts } from '@/db/schema';

async function main() {
    const sampleBlogPosts = [
        {
            title: 'Top 10 Luxury Neighborhoods in 2024',
            excerpt: 'Discover the most prestigious and sought-after neighborhoods that are redefining luxury living this year.',
            content: 'The luxury real estate market continues to evolve, with certain neighborhoods standing out for their exceptional amenities, prime locations, and investment potential. From waterfront properties with stunning views to gated communities offering unparalleled security and privacy, these areas represent the pinnacle of modern living. Notable trends include sustainable architecture, smart home technology integration, and proximity to cultural hubs. Whether you\'re looking for urban sophistication or suburban tranquility, these neighborhoods offer the perfect blend of elegance and convenience. Each area boasts unique characteristics, from award-winning schools to world-class dining and shopping experiences, making them ideal for discerning buyers seeking the ultimate lifestyle.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
            author: 'Sarah Mitchell',
            date: '2024-01-15',
            readTime: '8 min read',
            category: 'Market Insights',
            published: true,
            createdAt: new Date('2024-01-15T09:00:00Z').toISOString(),
            updatedAt: new Date('2024-01-15T09:00:00Z').toISOString(),
        },
        {
            title: 'Investment Tips for First-Time Buyers',
            excerpt: 'Essential strategies and advice to help first-time homebuyers make smart investment decisions in today\'s market.',
            content: 'Entering the real estate market as a first-time buyer can be both exciting and overwhelming. Understanding your financial position is crucial before making any commitments. Start by getting pre-approved for a mortgage to know your budget and strengthen your negotiating position. Research neighborhoods thoroughly, considering factors like future development plans, school districts, and commute times. Don\'t skip the home inspection—it can save you from costly surprises down the road. Consider the total cost of ownership, including property taxes, insurance, and maintenance. Work with an experienced real estate agent who understands the local market and can guide you through the process. Remember, your first home doesn\'t have to be your forever home; focus on properties with good resale potential.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=801',
            author: 'Michael Chen',
            date: '2024-02-03',
            readTime: '6 min read',
            category: 'Buying Tips',
            published: true,
            createdAt: new Date('2024-02-03T10:30:00Z').toISOString(),
            updatedAt: new Date('2024-02-03T10:30:00Z').toISOString(),
        },
        {
            title: 'How to Stage Your Home for a Quick Sale',
            excerpt: 'Professional staging tips that will help your property stand out and attract serious buyers faster.',
            content: 'Home staging is one of the most effective ways to maximize your property\'s appeal and selling price. Start by decluttering every room and removing personal items like family photos to help buyers envision themselves in the space. Deep clean everything, including carpets, windows, and fixtures—first impressions matter. Neutralize bold colors with fresh paint in warm, inviting tones that appeal to a broader audience. Arrange furniture to showcase the flow and functionality of each room, removing excess pieces to make spaces appear larger. Enhance curb appeal by maintaining the lawn, adding potted plants, and ensuring the entrance is welcoming. Pay special attention to the kitchen and bathrooms, as these rooms heavily influence buying decisions. Professional staging can increase your sale price by 5-15% and reduce time on market significantly.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=802',
            author: 'Emily Rodriguez',
            date: '2024-01-28',
            readTime: '5 min read',
            category: 'Selling Advice',
            published: true,
            createdAt: new Date('2024-01-28T14:15:00Z').toISOString(),
            updatedAt: new Date('2024-01-28T14:15:00Z').toISOString(),
        },
        {
            title: 'Understanding Real Estate Market Trends in 2024',
            excerpt: 'An in-depth analysis of current market conditions and what they mean for buyers and sellers.',
            content: 'The real estate market in 2024 is characterized by several key trends that are reshaping the industry. Interest rates have stabilized after years of volatility, creating new opportunities for strategic buyers. Remote work continues to influence location preferences, with many buyers seeking properties that offer dedicated home office spaces. Sustainability and energy efficiency have become major selling points, with eco-friendly homes commanding premium prices. Urban areas are experiencing a resurgence as cities adapt to post-pandemic realities, while suburban markets remain strong due to their spaciousness and lifestyle amenities. Technology integration, from virtual tours to digital closings, has become standard practice. Inventory levels vary significantly by region, creating distinct opportunities in different markets. Understanding these trends is essential for making informed real estate decisions.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=803',
            author: 'David Thompson',
            date: '2024-02-10',
            readTime: '7 min read',
            category: 'Market Insights',
            published: true,
            createdAt: new Date('2024-02-10T11:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-10T11:00:00Z').toISOString(),
        },
        {
            title: 'The Rise of Smart Home Technology in Real Estate',
            excerpt: 'How smart home features are transforming property values and buyer expectations.',
            content: 'Smart home technology has evolved from a luxury amenity to an expected feature in modern properties. Today\'s buyers increasingly prioritize homes equipped with intelligent systems that enhance security, energy efficiency, and convenience. From smart thermostats that learn your preferences to integrated security systems accessible from your smartphone, these technologies offer tangible benefits. Voice-activated assistants, automated lighting, and smart appliances are becoming standard in new constructions and renovated properties. The impact on property values is significant—homes with comprehensive smart technology systems can command 5-10% higher prices. Beyond the financial benefits, these systems provide peace of mind and improved quality of life. As technology continues to advance, the integration of AI and IoT devices will further revolutionize how we interact with our living spaces.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=804',
            author: 'Sarah Mitchell',
            date: '2024-02-15',
            readTime: '6 min read',
            category: 'Lifestyle',
            published: false,
            createdAt: new Date('2024-02-15T08:45:00Z').toISOString(),
            updatedAt: new Date('2024-02-16T10:30:00Z').toISOString(),
        },
        {
            title: 'Building Wealth Through Rental Property Investments',
            excerpt: 'A comprehensive guide to creating passive income and long-term wealth through rental properties.',
            content: 'Rental property investment remains one of the most reliable paths to building lasting wealth. The key is understanding the fundamentals: location, cash flow, and property management. Start by analyzing potential properties using the 1% rule—monthly rent should be at least 1% of the purchase price. Research rental demand in your target area and understand local landlord-tenant laws. Consider different property types: single-family homes offer simplicity, while multi-unit properties provide better cash flow potential. Factor in all costs including mortgage, insurance, taxes, maintenance, and vacancy rates when calculating returns. Professional property management can preserve your sanity and protect your investment. Leverage is your friend—using financing wisely allows you to control more property with less capital. Remember, rental properties generate wealth through multiple channels: monthly cash flow, property appreciation, mortgage paydown, and tax benefits.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=805',
            author: 'Michael Chen',
            date: '2024-01-22',
            readTime: '9 min read',
            category: 'Investment',
            published: true,
            createdAt: new Date('2024-01-22T13:20:00Z').toISOString(),
            updatedAt: new Date('2024-01-22T13:20:00Z').toISOString(),
        },
        {
            title: 'Navigating the Home Inspection Process',
            excerpt: 'What every buyer and seller needs to know about home inspections to protect their interests.',
            content: 'The home inspection is a critical step in any real estate transaction that can make or break a deal. For buyers, it\'s your opportunity to uncover potential issues before finalizing the purchase. Hire a licensed, experienced inspector and attend the inspection in person to ask questions and gain insights. Inspectors examine structural elements, roofing, plumbing, electrical systems, HVAC, and more. Understanding the difference between major defects and minor issues is crucial for negotiating effectively. Major concerns like foundation problems or roof damage warrant serious attention, while cosmetic issues should be weighed proportionally. For sellers, having a pre-listing inspection can identify problems before listing, allowing you to make repairs or adjust pricing accordingly. This proactive approach can prevent last-minute surprises that derail sales. Remember, no home is perfect—focus on safety and significant system issues.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=806',
            author: 'Emily Rodriguez',
            date: '2024-02-05',
            readTime: '5 min read',
            category: 'Buying Tips',
            published: true,
            createdAt: new Date('2024-02-05T15:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-05T15:00:00Z').toISOString(),
        },
        {
            title: 'Sustainable Living: Eco-Friendly Home Features That Add Value',
            excerpt: 'Discover how green building practices and sustainable features are enhancing property values and appeal.',
            content: 'Sustainability is no longer just a buzzword—it\'s a major factor driving real estate decisions. Eco-friendly features like solar panels, energy-efficient windows, and high-performance insulation can significantly reduce utility costs while increasing property value. Modern buyers are increasingly conscious of environmental impact and appreciate homes that minimize their carbon footprint. Features such as rainwater harvesting systems, native landscaping, and smart irrigation reduce water consumption. Energy-efficient appliances and LED lighting offer immediate savings and long-term benefits. Green building certifications like LEED or Energy Star can command premium prices and faster sales. Beyond financial considerations, sustainable homes offer healthier indoor environments with better air quality and natural lighting. As climate concerns grow, properties with green features will likely see continued appreciation and demand.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=807',
            author: 'David Thompson',
            date: '2024-01-18',
            readTime: '7 min read',
            category: 'Lifestyle',
            published: true,
            createdAt: new Date('2024-01-18T09:30:00Z').toISOString(),
            updatedAt: new Date('2024-01-18T09:30:00Z').toISOString(),
        }
    ];

    await db.insert(blogPosts).values(sampleBlogPosts);
    
    console.log('✅ Blog posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});