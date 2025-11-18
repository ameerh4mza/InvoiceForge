# 🗄️ Database Setup Guide for InvoiceForge

This guide will help you connect your InvoiceForge application to a PostgreSQL database so that all your products, receipts, and analytics data persist permanently.

## 📋 What You'll Get

Once connected, your database will:

- ✅ Store all products permanently (won't lose them on restart)
- ✅ Save all generated receipts with full history
- ✅ Keep accurate analytics and dashboard data
- ✅ Track daily, weekly, and monthly income
- ✅ Maintain payment method statistics

## 🚀 Quick Start (Recommended: Neon - Free Cloud Database)

### Option 1: Neon (Easiest - Free Tier Available)

1. **Create a Neon Account**

   - Go to https://neon.tech
   - Sign up for a free account (no credit card required)
   - Click "Create Project"
   - Name it "InvoiceForge"

2. **Get Your Connection String**

   - After creating the project, you'll see a connection string
   - It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - Click "Copy" to copy the full connection string

3. **Update Your .env File**

   - Open `d:\Next\InvoiceForge\.env`
   - Replace the DATABASE_URL line with your Neon connection string:

   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

4. **Run Database Setup**

   ```powershell
   npm run db:setup
   ```

   You should see:

   ```
   ✅ Database connection successful!
   ✅ Database tables created successfully!
   🎉 Database setup complete!
   ```

5. **Start Your Application**

   ```powershell
   npm run dev
   ```

   You should now see:

   ```
   ✅ Using PostgreSQL database storage
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**

   - Download from https://www.postgresql.org/download/windows/
   - Run the installer
   - Remember the password you set for the `postgres` user
   - Default port is 5432

2. **Create Database**

   - Open pgAdmin (installed with PostgreSQL)
   - Right-click "Databases" → "Create" → "Database"
   - Name: `invoiceforge`
   - Click "Save"

3. **Update Your .env File**

   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/invoiceforge
   ```

   Replace `YOUR_PASSWORD` with your PostgreSQL password

4. **Run Database Setup**

   ```powershell
   npm run db:setup
   ```

5. **Start Your Application**
   ```powershell
   npm run dev
   ```

## 🔍 Verifying the Connection

When you start the app with `npm run dev`, look for these messages:

**✅ SUCCESS (Database Connected):**

```
✅ Using PostgreSQL database storage
6:00:44 PM [express] serving on port 5000
```

**❌ FAILURE (Still Using Memory):**

```
⚠️  WARNING: Using in-memory storage! Data will be lost on server restart.
⚠️  Set DATABASE_URL environment variable to use PostgreSQL database.
```

## 📊 Testing Your Database

1. **Add a Product**

   - Go to http://localhost:5000
   - Navigate to "Products" page
   - Click "Add Product"
   - Add a test product

2. **Generate a Receipt**

   - Navigate to "Generate Receipt"
   - Add some items
   - Complete the purchase
   - Download/view the receipt

3. **Check Dashboard**

   - Go to "Dashboard"
   - You should see updated analytics
   - Daily, weekly, monthly income should reflect your test receipt

4. **Restart Server**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again
   - Your products and receipts should still be there! 🎉

## 🔧 Troubleshooting

### Error: "Could not connect to database"

**Check your DATABASE_URL:**

- Make sure it's properly set in `.env`
- No extra spaces or quotes around the URL
- The format should be: `postgresql://user:password@host:port/database`

### Error: "password authentication failed"

**For Local PostgreSQL:**

- Check your PostgreSQL password is correct
- Try logging into pgAdmin with the same credentials

**For Neon:**

- Make sure you copied the full connection string including the password

### Warning: "Using in-memory storage"

This means your `.env` file isn't being loaded:

- Make sure `.env` file is in the root directory: `d:\Next\InvoiceForge\.env`
- Check that `dotenv` is installed (should already be done)
- Restart your dev server

### Error: "relation 'products' does not exist"

You need to run the database setup:

```powershell
npm run db:setup
```

## 📁 Database Structure

Your database has two main tables:

### **products**

- `id` - Unique identifier (auto-generated)
- `name` - Product name
- `description` - Product description (optional)
- `price` - Product price (decimal)

### **receipts**

- `id` - Unique identifier (auto-generated)
- `receipt_number` - Unique receipt number (e.g., "RCP-001")
- `date` - Receipt date/time
- `payment_method` - "cash" or "card"
- `subtotal` - Subtotal amount
- `tax` - Tax amount
- `total` - Total amount
- `items` - JSON string of receipt items

## 🎯 Next Steps

After connecting your database:

1. **Remove sample products** from the migration if you want to start fresh
2. **Set up backups** (Neon does this automatically)
3. **Monitor usage** through Neon dashboard or pgAdmin
4. **Add more products** through your app
5. **Generate real receipts** and watch your analytics grow!

## 💡 Free Tier Limits

**Neon Free Tier:**

- 3 projects
- 10 branches per project
- 3GB storage
- Perfect for development and small businesses!

**Supabase Free Tier:**

- 500MB database
- 5GB bandwidth
- Great alternative to Neon

## 📞 Need Help?

If you encounter issues:

1. Check the server console for error messages
2. Verify your DATABASE_URL format
3. Test database connection using pgAdmin or Neon dashboard
4. Make sure all migrations ran successfully with `npm run db:setup`

---

**Current Status:**

- ✅ dotenv installed
- ✅ Server configured to load .env
- ✅ Database migration files created
- ✅ Setup script ready (`npm run db:setup`)
- ⏳ Waiting for you to set DATABASE_URL and run setup

**You're almost there!** Just set your DATABASE_URL and run `npm run db:setup` 🚀
