import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // .env ફાઈલમાંથી ડેટા વાંચવા માટે

const { Pool } = pkg;

// આ એક જ લાઈન બંને જગ્યાએ કામ કરશે
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech') 
         ? { rejectUnauthorized: false } 
         : false
});

pool.connect((err) => {
    if (err) {
        console.error('❌ Database connection error:', err.stack);
    } else {
        const dbType = process.env.DATABASE_URL?.includes('localhost') ? 'pgAdmin' : 'Neon Cloud';
        console.log(`✅ Connected to ${dbType} successfully`);
    }
});

export default pool;