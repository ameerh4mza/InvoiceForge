import type { Request, Response } from "express";
import express from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products, receipts } from "../shared/schema.js";
import { eq } from "drizzle-orm";

const app = express();

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Products routes
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newProduct = await db
      .insert(products)
      .values({ name, description, price })
      .returning();
    res.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const updatedProduct = await db
      .update(products)
      .set({ name, description, price })
      .where(eq(products.id, id))
      .returning();

    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (deletedProduct.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Receipts routes
app.get("/api/receipts", async (req, res) => {
  try {
    const { paymentMethod } = req.query;

    const allReceipts =
      paymentMethod && paymentMethod !== "all"
        ? await db.select().from(receipts).where(eq(receipts.paymentMethod, paymentMethod as string))
        : await db.select().from(receipts);

    res.json(allReceipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
});

app.post("/api/receipts", async (req, res) => {
  try {
    const { receiptNumber, paymentMethod, subtotal, tax, total, items } =
      req.body;

    const newReceipt = await db
      .insert(receipts)
      .values({
        receiptNumber,
        paymentMethod,
        subtotal,
        tax,
        total,
        items,
        date: new Date(),
      })
      .returning();

    res.json(newReceipt[0]);
  } catch (error) {
    console.error("Error creating receipt:", error);
    res.status(500).json({ error: "Failed to create receipt" });
  }
});

// Analytics route
app.get("/api/analytics", async (req, res) => {
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

    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      avgOrderValue: avgOrderValue.toFixed(2),
      todayRevenue: todayRevenue.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Catch-all handler for the serverless function
export default (req: Request, res: Response) => {
  return app(req, res);
};
