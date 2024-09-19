const mysql = require('mysql2/promise');

const mySqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Admin1236',
    database: 'students_db',
    // connectionLimit: 10, // Maximum number of connections
});

module.exports = mySqlPool;