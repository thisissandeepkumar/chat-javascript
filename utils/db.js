const sql = require('mysql2');

const connection = sql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

connection.connect(error => {
    if(error) throw error;
    console.log('Database connected!');
});

module.exports = connection;