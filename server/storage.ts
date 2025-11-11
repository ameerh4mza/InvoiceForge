import { type Product, type InsertProduct, type Receipt, type InsertReceipt } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Receipt operations
  getReceipts(): Promise<Receipt[]>;
  getReceipt(id: string): Promise<Receipt | undefined>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  getReceiptsByPaymentMethod(method: string): Promise<Receipt[]>;
  getReceiptsByDateRange(startDate: Date, endDate: Date): Promise<Receipt[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private receipts: Map<string, Receipt>;

  constructor() {
    this.products = new Map();
    this.receipts = new Map();
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed some initial products
    const initialProducts: Product[] = [
      { id: randomUUID(), name: 'Coffee', description: 'Freshly brewed coffee', price: '4.50' },
      { id: randomUUID(), name: 'Sandwich', description: 'Ham and cheese sandwich', price: '8.99' },
      { id: randomUUID(), name: 'Cookie', description: 'Chocolate chip cookie', price: '2.50' },
      { id: randomUUID(), name: 'Salad', description: 'Fresh garden salad', price: '7.99' },
      { id: randomUUID(), name: 'Smoothie', description: 'Mixed berry smoothie', price: '6.50' },
    ];

    initialProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      id,
      name: insertProduct.name,
      description: insertProduct.description || null,
      price: insertProduct.price,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, insertProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = { 
      ...existing,
      ...(insertProduct.name !== undefined && { name: insertProduct.name }),
      ...(insertProduct.description !== undefined && { description: insertProduct.description || null }),
      ...(insertProduct.price !== undefined && { price: insertProduct.price }),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Receipt operations
  async getReceipts(): Promise<Receipt[]> {
    return Array.from(this.receipts.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getReceipt(id: string): Promise<Receipt | undefined> {
    return this.receipts.get(id);
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const id = randomUUID();
    const receipt: Receipt = { 
      id,
      receiptNumber: insertReceipt.receiptNumber,
      date: insertReceipt.date || new Date(),
      paymentMethod: insertReceipt.paymentMethod,
      subtotal: insertReceipt.subtotal,
      tax: insertReceipt.tax || '0',
      total: insertReceipt.total,
      items: insertReceipt.items,
    };
    this.receipts.set(id, receipt);
    return receipt;
  }

  async getReceiptsByPaymentMethod(method: string): Promise<Receipt[]> {
    return Array.from(this.receipts.values())
      .filter(receipt => receipt.paymentMethod === method)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getReceiptsByDateRange(startDate: Date, endDate: Date): Promise<Receipt[]> {
    return Array.from(this.receipts.values())
      .filter(receipt => {
        const receiptDate = new Date(receipt.date);
        return receiptDate >= startDate && receiptDate <= endDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const storage = new MemStorage();
