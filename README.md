# InvoiceForge - Modern Receipt & Inventory Management

A modern web application for generating receipts, managing products, and tracking sales analytics.

## Features

- 📝 Generate professional PDF receipts
- 🛍️ Product management (CRUD operations)
- 📊 Sales analytics dashboard (daily/weekly/monthly)
- 💳 Payment method tracking (Cash/Card)
- 🔍 Receipt history with search & filters
- 💾 PostgreSQL database for data persistence

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Free Neon database account (https://neon.tech)

### Installation

1. **Clone the repository:**

   ```powershell
   git clone <your-repo-url>
   cd InvoiceForge
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Create your database:**

   - Go to https://neon.tech
   - Sign up for a free account
   - Create a new project (name it anything you like)
   - Copy your connection string (it looks like: `postgresql://...`)

4. **Configure environment:**

   - Create a `.env` file in the project root
   - Add your database URL:

   ```env
   DATABASE_URL=postgresql://your_username:your_password@your-host.neon.tech/your_db?sslmode=require
   ```

5. **Initialize database:**

   ```powershell
   npm run db:setup
   ```

   This creates tables and adds 5 sample products.

6. **Start the application:**

   ```powershell
   npm run dev
   ```

7. **Open your browser:**
   - Navigate to http://localhost:5000
   - Start generating receipts! 🎉

## Custom Logo (Optional)

To use your own logo in receipts:

1. Convert your logo to PNG format
2. Name it `logo.png`
3. Place it in `client/public/logo.png`
4. Generate a new receipt - your logo will appear automatically!

## Database Information

### Neon Free Tier:

- ✅ **Free forever** - No time limit
- ✅ **512 MB storage** - Enough for 500,000+ receipts
- ✅ **200 hours/month** active time
- ✅ **Perfect for small to medium businesses**

### Data Stored:

- **Products:** Name, price, stock quantity
- **Receipts:** Receipt number, date, items, totals, payment method
- **Analytics:** Automatically calculated from receipts

## Tech Stack

- **Frontend:** React, TypeScript, TanStack Query, Tailwind CSS
- **Backend:** Express.js, PostgreSQL (via Neon)
- **PDF Generation:** jsPDF
- **Database ORM:** Direct SQL queries

## Project Structure

```
InvoiceForge/
├── client/              # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities (PDF generator, etc.)
│   └── public/          # Static assets (add logo here)
├── server/              # Backend Express API
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Database abstraction
│   └── database-storage.ts  # PostgreSQL implementation
├── shared/              # Shared types between client/server
└── migrations/          # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:setup` - Initialize database tables
- `npm start` - Start production server

## Support

For issues or questions:

1. Check that your `.env` file has the correct `DATABASE_URL`
2. Ensure your Neon database is active
3. Run `npm run db:setup` if tables are missing

## License

MIT
