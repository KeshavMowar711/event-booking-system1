const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'event_booking_db',
    waitForConnections: true,
    connectionLimit: 10
});

// Test the connection immediately on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL Database: event_booking_db');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed!');
        console.error('Reason:', err.message);
    });
module.exports = pool;