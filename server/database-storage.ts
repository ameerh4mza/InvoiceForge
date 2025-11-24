import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { Pool } from "pg";
import {
  products,
  receipts,
  type Product,
  type InsertProduct,
  type Receipt,
  type InsertReceipt,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for database storage");
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(pool);
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await this.db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await this.db
      .insert(products)
      .values(insertProduct)
      .returning();
    return result[0];
  }

  async updateProduct(
    id: string,
    insertProduct: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const result = await this.db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Receipt operations
  async getReceipts(): Promise<Receipt[]> {
    return await this.db.select().from(receipts).orderBy(desc(receipts.date));
  }

  async getReceipt(id: string): Promise<Receipt | undefined> {
    const result = await this.db
      .select()
      .from(receipts)
      .where(eq(receipts.id, id));
    return result[0];
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const dateValue =
      insertReceipt.date && typeof insertReceipt.date === "string"
        ? new Date(insertReceipt.date)
        : (insertReceipt.date as Date | undefined);

    const values = {
      ...insertReceipt,
      date: dateValue,
    };

    // Narrow the type for the DB insert; cast to any to satisfy the drizzle overload expecting Date (not string)
    const result = await this.db.insert(receipts).values(values as any).returning();
    return result[0];
  }

  async getReceiptsByPaymentMethod(method: string): Promise<Receipt[]> {
    return await this.db
      .select()
      .from(receipts)
      .where(eq(receipts.paymentMethod, method))
      .orderBy(desc(receipts.date));
  }

  async getReceiptsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Receipt[]> {
    return await this.db
      .select()
      .from(receipts)
      .where(and(gte(receipts.date, startDate), lte(receipts.date, endDate)))
      .orderBy(desc(receipts.date));
  }
}
