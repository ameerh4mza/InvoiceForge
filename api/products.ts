import { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "../shared/schema";
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
        const allProducts = await db.select().from(products);
        return res.status(200).json(allProducts);

      case "POST":
        const { name, description, price } = req.body;
        if (!name || !price) {
          return res.status(400).json({ error: "Name and price are required" });
        }

        const newProduct = await db
          .insert(products)
          .values({ name, description: description || "", price })
          .returning();

        return res.status(201).json(newProduct[0]);

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Products API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
