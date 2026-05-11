import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Railway aane auto detect kari leshe
  ssl: {
    rejectUnauthorized: false // Online hosting mate aa jaruri chhe
  }
});

export default pool;