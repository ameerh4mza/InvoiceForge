import { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { receipts } from "../shared/schema";

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const allReceipts = await db.select().from(receipts);

    const totalRevenue = allReceipts.reduce(
      (sum, receipt) => sum + parseFloat(receipt.total),
      0
    );

    const totalOrders = allReceipts.length;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayReceipts = allReceipts.filter(
      (receipt) => new Date(receipt.date) >= todayStart
    );

    const todayRevenue = todayReceipts.reduce(
      (sum, receipt) => sum + parseFloat(receipt.total),
      0
    );

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const analytics = {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      avgOrderValue: avgOrderValue.toFixed(2),
      todayRevenue: todayRevenue.toFixed(2),
    };

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Analytics API error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
