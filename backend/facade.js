// get the client
const mysql = require('mysql2');

class Facade {

    pool;

    constructor() {
        // Create the connection pool. The pool-specific settings are the defaults
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            database: 'api-demo',
            password: 'password',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    loadJobs(onResult) {
        // For pool initialization, see above
        this.pool.query("SELECT * FROM job", function(err, rows, fields) {
            // Connection is automatically released when query resolves
            onResult(rows, fields);
        });
    }

}



module.exports = { Facade };