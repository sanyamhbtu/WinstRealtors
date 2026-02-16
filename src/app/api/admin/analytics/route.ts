import { NextResponse } from "next/server";
import { db } from "@/db";
import { trafficLogs } from "@/db/schema";
import { desc, sql, count } from "drizzle-orm";

export async function GET() {
  try {
    // Recent logs
    const logs = await db
      .select()
      .from(trafficLogs)
      .orderBy(desc(trafficLogs.createdAt))
      .limit(100);

    // Total visits
    const totalResult = await db
      .select({ value: count() })
      .from(trafficLogs);
    const totalVisits = totalResult[0].value;

    // Unique visitors (using simple SQL count distinct)
    const uniqueResult = await db
        .select({ value: count(trafficLogs.ipHash) }) // Note: count(distinct column) not directly supported in simple count helper sometimes, need sql
        .from(trafficLogs);
    
    // Better unique count with SQL
    const uniqueVisitorsResult = await db.run(sql`SELECT COUNT(DISTINCT ip_hash) as count FROM traffic_logs`);
    const uniqueVisitors = uniqueVisitorsResult.rows[0]?.count || 0;

    // Daily Visits (Last 30 days)
    const dailyStatsResult = await db.run(sql`
      SELECT 
        strftime('%Y-%m-%d', datetime(created_at, 'unixepoch', 'localtime')) as date,
        COUNT(*) as count
      FROM traffic_logs
      WHERE created_at > (unixepoch('now') - 30 * 24 * 60 * 60)
      GROUP BY date
      ORDER BY date ASC
    `);

    // Weekly Visits (Last 12 weeks)
    const weeklyStatsResult = await db.run(sql`
      SELECT 
        strftime('%Y-W%W', datetime(created_at, 'unixepoch', 'localtime')) as week,
        COUNT(*) as count
      FROM traffic_logs
      WHERE created_at > (unixepoch('now') - 90 * 24 * 60 * 60)
      GROUP BY week
      ORDER BY week ASC
    `);

    // Monthly Visits (Last 12 months)
    const monthlyStatsResult = await db.run(sql`
      SELECT 
        strftime('%Y-%m', datetime(created_at, 'unixepoch', 'localtime')) as month,
        COUNT(*) as count
      FROM traffic_logs
      WHERE created_at > (unixepoch('now') - 365 * 24 * 60 * 60)
      GROUP BY month
      ORDER BY month ASC
    `);

    // Device Stats (Desktop vs Mobile)
    const deviceStatsResult = await db.run(sql`
      SELECT 
        CASE 
          WHEN user_agent LIKE '%Mobile%' THEN 'Mobile' 
          ELSE 'Desktop' 
        END as device_type,
        COUNT(*) as count
      FROM traffic_logs
      GROUP BY device_type
    `);

    // Group by Country
    const countryStatsResult = await db.run(sql`
        SELECT country, COUNT(*) as count 
        FROM traffic_logs 
        WHERE country IS NOT NULL 
        GROUP BY country 
        ORDER BY count DESC 
        LIMIT 5
    `);
    
    return NextResponse.json({
      recentLogs: logs,
      stats: {
        totalVisits,
        uniqueVisitors: Number(uniqueVisitors),
        topCountries: countryStatsResult.rows,
        // Charts Data
        daily: dailyStatsResult.rows,
        weekly: weeklyStatsResult.rows,
        monthly: monthlyStatsResult.rows,
        devices: deviceStatsResult.rows
      }
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
