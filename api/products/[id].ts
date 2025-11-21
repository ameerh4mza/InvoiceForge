import { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "../../shared/schema";
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

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    switch (req.method) {
      case "PUT":
        const { name, description, price } = req.body;
        if (!name || !price) {
          return res.status(400).json({ error: "Name and price are required" });
        }

        const updatedProduct = await db
          .update(products)
          .set({ name, description: description || "", price })
          .where(eq(products.id, id))
          .returning();

        if (updatedProduct.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json(updatedProduct[0]);

      case "DELETE":
        const deletedProduct = await db
          .delete(products)
          .where(eq(products.id, id))
          .returning();

        if (deletedProduct.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Product API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
