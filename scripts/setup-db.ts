import "dotenv/config";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in .env file");
    console.log("\n📝 Please update your .env file with a valid database URL:");
    console.log(
      "   DATABASE_URL=postgresql://username:password@hostname:5432/database_name"
    );
    process.exit(1);
  }

  console.log("🔄 Connecting to database...");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful!");

    // Read and execute migration SQL
    const migrationPath = path.join(
      __dirname,
      "..",
      "migrations",
      "0000_initial.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("🔄 Running database migrations...");
    await pool.query(migrationSQL);
    console.log("✅ Database tables created successfully!");

    // Verify tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('products', 'receipts')
    `);

    console.log("\n📊 Database tables:");
    result.rows.forEach((row) => {
      console.log(`   ✓ ${row.table_name}`);
    });

    // Count initial data
    const productCount = await pool.query("SELECT COUNT(*) FROM products");
    const receiptCount = await pool.query("SELECT COUNT(*) FROM receipts");

    console.log("\n📈 Current data:");
    console.log(`   Products: ${productCount.rows[0].count}`);
    console.log(`   Receipts: ${receiptCount.rows[0].count}`);

    console.log("\n🎉 Database setup complete!");
    console.log("   You can now run: npm run dev");
  } catch (error) {
    console.error("\n❌ Database setup failed:");
    console.error(error);
    console.log("\n💡 Tips:");
    console.log("   - Check if your DATABASE_URL is correct");
    console.log("   - Make sure your database is running");
    console.log("   - Verify you have the correct permissions");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
