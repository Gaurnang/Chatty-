import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

try {
  await pool.query("SELECT 1");
  console.log("✅ PostgreSQL Connected");
} catch (err) {
  console.error("❌ Database Connection Failed");
  console.error(err.message);
}

export default pool;