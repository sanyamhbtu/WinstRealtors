import 'dotenv/config';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Attempting to create traffic_logs table...');
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS traffic_logs (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        path text,
        user_agent text,
        ip_hash text,
        country text,
        city text,
        device text,
        created_at integer NOT NULL
      );
    `);
    console.log('Successfully created traffic_logs table.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
  process.exit(0);
}

main();
