// get the client
const mysql = require('mysql2');
var _ = require('underscore');

class MySQLDao {

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
        this.pool.query("SELECT * FROM job", function (err, rows, fields) {
            // Connection is automatically released when query resolves
            onResult(rows, fields);
        });
    }

    executeInsert(statement, params, returnField) {
        return new Promise((resolve, reject) => {
            this.pool.execute(
                statement,
                params,
                function (error, result, fields) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        resolve({ [returnField]: result.insertId });
                    }
                })
        });
    }

    /**
     * creare un project che contenga un array di job (almeno uno al momento della creazione)
     */
    insertNewProject(title, jobs, onResult) {
        var promises = [];
        promises.push(this.executeInsert('INSERT INTO `api-demo`.`project`(`title`) VALUES (?);', [title], 'projectId'));
        for (var job of jobs) {
            console.log(`saving job with price ${job.price} for project ${title}`);
            promises.push(this.executeInsert('INSERT INTO `api-demo`.`job` (`creationDate`,`price`,`status`) VALUES (now(), ?, ?);', [job.price, 1], 'jobId'));
        }
        Promise.all(promises).then((values) => {
            var jobIds = _.pluck(values, 'jobId');
            var assignments = [];
            var projectId = _.filter(values, function (elem) { return !_.isUndefined(elem.projectId); })[0].projectId;
            for (var jobId of _.compact(jobIds)) {
                assignments.push(this.executeInsert('INSERT INTO `api-demo`.`assignment` (`projectId`, `jobId`) VALUES (?, ?);', [projectId, jobId], 'assignmentId'));
            }
            Promise.all(promises).then((assignmentValues) => {
                onResult(projectId);
            });
        });

    }

}



module.exports = { MySQLDao };