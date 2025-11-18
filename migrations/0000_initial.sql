-- Initial database schema for InvoiceForge

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT NOT NULL UNIQUE,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  payment_method TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  items TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
CREATE INDEX IF NOT EXISTS idx_receipts_payment_method ON receipts(payment_method);

-- Insert some sample products (optional)
INSERT INTO products (name, description, price) VALUES
  ('Coffee', 'Freshly brewed coffee', 4.50),
  ('Sandwich', 'Ham and cheese sandwich', 8.99),
  ('Cookie', 'Chocolate chip cookie', 2.50),
  ('Salad', 'Fresh garden salad', 7.99),
  ('Smoothie', 'Mixed berry smoothie', 6.50)
ON CONFLICT DO NOTHING;
