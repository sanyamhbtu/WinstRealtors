import 'dotenv/config';
import { db } from '@/db';
import { trafficLogs } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';

async function main() {
  console.log('Checking raw traffic_logs...');
  try {
    const result = await db.run(sql`SELECT * FROM traffic_logs ORDER BY id DESC LIMIT 1`);
    console.log('Raw Result:', result.rows);
  } catch (error) {
    console.error('Error reading logs:', error);
  }
  process.exit(0);
}

main();
