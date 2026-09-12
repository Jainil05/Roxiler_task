const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        console.log('Connected to MySQL server.');
        const sqlPath = path.join(__dirname, '../../database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        console.log('Importing database.sql...');
        await connection.query(sql);
        console.log('Database and seed data successfully initialized!');
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

initDB();
