import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertReceiptSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Receipt routes
  app.get("/api/receipts", async (req, res) => {
    try {
      const { paymentMethod, startDate, endDate } = req.query;

      let receipts;
      if (paymentMethod && paymentMethod !== "all") {
        receipts = await storage.getReceiptsByPaymentMethod(
          paymentMethod as string
        );
      } else if (startDate && endDate) {
        receipts = await storage.getReceiptsByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        receipts = await storage.getReceipts();
      }

      res.json(receipts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch receipts" });
    }
  });

  app.get("/api/receipts/:id", async (req, res) => {
    try {
      const receipt = await storage.getReceipt(req.params.id);
      if (!receipt) {
        return res.status(404).json({ error: "Receipt not found" });
      }
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch receipt" });
    }
  });

  app.post("/api/receipts", async (req, res) => {
    try {
      console.log("Receipt data received:", JSON.stringify(req.body, null, 2));
      const validatedData = insertReceiptSchema.parse(req.body);
      const receipt = await storage.createReceipt(validatedData);
      res.status(201).json(receipt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "Validation errors:",
          JSON.stringify(error.errors, null, 2)
        );
        return res
          .status(400)
          .json({ error: "Invalid receipt data", details: error.errors });
      }
      console.error("Receipt creation error:", error);
      res.status(500).json({ error: "Failed to create receipt" });
    }
  });

  // Analytics route
  app.get("/api/analytics", async (req, res) => {
    try {
      const receipts = await storage.getReceipts();
      const now = new Date();

      // Calculate date ranges
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);

      const startOfThisWeek = new Date(now);
      startOfThisWeek.setDate(now.getDate() - now.getDay());
      startOfThisWeek.setHours(0, 0, 0, 0);

      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Calculate daily income
      const todayReceipts = receipts.filter(
        (r) => new Date(r.date) >= startOfToday
      );
      const yesterdayReceipts = receipts.filter((r) => {
        const date = new Date(r.date);
        return date >= startOfYesterday && date < startOfToday;
      });

      const dailyIncome = todayReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const yesterdayIncome = yesterdayReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const dailyChange =
        yesterdayIncome > 0
          ? ((dailyIncome - yesterdayIncome) / yesterdayIncome) * 100
          : dailyIncome > 0
          ? 100
          : 0;

      // Calculate weekly income
      const thisWeekReceipts = receipts.filter(
        (r) => new Date(r.date) >= startOfThisWeek
      );
      const lastWeekReceipts = receipts.filter((r) => {
        const date = new Date(r.date);
        return date >= startOfLastWeek && date < startOfThisWeek;
      });

      const weeklyIncome = thisWeekReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const lastWeekIncome = lastWeekReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const weeklyChange =
        lastWeekIncome > 0
          ? ((weeklyIncome - lastWeekIncome) / lastWeekIncome) * 100
          : weeklyIncome > 0
          ? 100
          : 0;

      // Calculate monthly income
      const thisMonthReceipts = receipts.filter(
        (r) => new Date(r.date) >= startOfThisMonth
      );
      const lastMonthReceipts = receipts.filter((r) => {
        const date = new Date(r.date);
        return date >= startOfLastMonth && date <= endOfLastMonth;
      });

      const monthlyIncome = thisMonthReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const lastMonthIncome = lastMonthReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const monthlyChange =
        lastMonthIncome > 0
          ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100
          : monthlyIncome > 0
          ? 100
          : 0;

      // Calculate payment method distribution
      const cardReceipts = receipts.filter((r) => r.paymentMethod === "card");
      const cashReceipts = receipts.filter((r) => r.paymentMethod === "cash");

      const cardTotal = cardReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const cashTotal = cashReceipts.reduce(
        (sum, r) => sum + parseFloat(r.total),
        0
      );
      const totalIncome = cardTotal + cashTotal;

      // Get recent receipts
      const recentReceipts = receipts.slice(0, 5).map((r) => ({
        id: r.id,
        number: r.receiptNumber,
        amount: parseFloat(r.total),
        method: r.paymentMethod,
        date: r.date,
      }));

      // Calculate top products
      const productSales: {
        [key: string]: { count: number; revenue: number; name: string };
      } = {};

      for (const receipt of receipts) {
        const items = JSON.parse(receipt.items);
        for (const item of items) {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              count: 0,
              revenue: 0,
              name: item.productName,
            };
          }
          productSales[item.productId].count += item.quantity;
          productSales[item.productId].revenue += item.subtotal;
        }
      }

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((p) => ({
          name: p.name,
          count: p.count,
          revenue: p.revenue,
        }));

      res.json({
        daily: {
          income: dailyIncome,
          change: Math.round(dailyChange * 10) / 10,
        },
        weekly: {
          income: weeklyIncome,
          change: Math.round(weeklyChange * 10) / 10,
        },
        monthly: {
          income: monthlyIncome,
          change: Math.round(monthlyChange * 10) / 10,
        },
        paymentMethods: {
          card: {
            total: cardTotal,
            percentage:
              totalIncome > 0 ? Math.round((cardTotal / totalIncome) * 100) : 0,
          },
          cash: {
            total: cashTotal,
            percentage:
              totalIncome > 0 ? Math.round((cashTotal / totalIncome) * 100) : 0,
          },
        },
        recentReceipts,
        topProducts,
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to calculate analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
