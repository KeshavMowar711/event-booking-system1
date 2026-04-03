const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool using Railway Environment Variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Critical for cloud deployment
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Immediate Connection Test
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL Database on Railway!');
        connection.release();
    } catch (err) {
        console.error('❌ Database connection failed!');
        console.error('Error Code:', err.code);
        console.error('Reason:', err.message);
        console.error('Check your Railway Variables for DB_HOST, DB_USER, etc.');
    }
})();

module.exports = pool;