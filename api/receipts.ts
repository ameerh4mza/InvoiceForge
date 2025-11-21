import { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { receipts } from "../shared/schema";
import { eq } from "drizzle-orm";

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case "GET":
        const { paymentMethod } = req.query;

        const allReceipts =
          paymentMethod && paymentMethod !== "all"
            ? await db
                .select()
                .from(receipts)
                .where(eq(receipts.paymentMethod, paymentMethod as string))
            : await db.select().from(receipts);

        return res.status(200).json(allReceipts);

      case "POST":
        const {
          receiptNumber,
          paymentMethod: pm,
          subtotal,
          tax,
          total,
          items,
        } = req.body;

        if (!receiptNumber || !pm || !subtotal || !total || !items) {
          return res
            .status(400)
            .json({ error: "Missing required receipt data" });
        }

        const newReceipt = await db
          .insert(receipts)
          .values({
            receiptNumber,
            paymentMethod: pm,
            subtotal,
            tax: tax || "0",
            total,
            items,
            date: new Date(),
          })
          .returning();

        return res.status(201).json(newReceipt[0]);

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Receipts API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
