const mysql = require('mysql2');
var _ = require('underscore');

class MySQLDao {

    static instance;
    pool;

    /**
     * in a dev environment DB_HOST is localhost, while if the app is launched into a docker container
     * the DB_HOST value is mysql_server
     */
    constructor() {
        // Create the connection pool. The pool-specific settings are the defaults
        console.log('Creating connection pool...')
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: 'root',
            database: 'api-demo',
            password: 'password',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    static getInstance() {
        if (!this.instance){
            this.instance = new MySQLDao();
        }
        return this.instance;
    }

    /**
     * 
     * @param {*} statement 
     * @param {*} params 
     * @param {*} returnField 
     * @param {*} rowsField 
     * @returns 
     */
    executeStatement(statement, params, returnField, rowsField) {
        return new Promise((resolve, reject) => {
            this.pool.execute(
                statement,
                params,
                function (err, rows, fields) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve({ [returnField]: rows[rowsField] });
                    }
                })
        });
    }

    /**
     * 
     * @param {*} title 
     * @param {*} jobs 
     * @param {*} onResult 
     * @param {*} onError 
     */
    insertNewProject(title, jobs, onResult, onError) {
        var promises = [];
        var self = this;
        promises.push(this.executeStatement('INSERT INTO `project`(`title`) VALUES (?);', [title], 'projectId', 'insertId'));
        for (var job of jobs) {
            console.log(`saving job with price ${job.price} for project ${title}`);
            promises.push(this.executeStatement('INSERT INTO `job` (`creationDate`,`price`,`status`) VALUES (now(), ?, ?);', [job.price, 1], 'jobId', 'insertId'));
        }
        Promise.all(promises).then((values) => {
            var jobIds = _.pluck(values, 'jobId');
            var assignments = [];
            var projectId = _.filter(values, function (elem) { return !_.isUndefined(elem.projectId); })[0].projectId;
            for (var jobId of _.compact(jobIds)) {
                assignments.push(self.executeStatement('INSERT INTO `assignment` (`projectId`, `jobId`) VALUES (?, ?);', [projectId, jobId], 'assignmentId', 'insertId'));
            }
            Promise.all(assignments).then((assignmentValues) => {
                onResult(projectId);
            }).catch((err) => {
                onError(err);
            });
        }).catch((err) => {
            onError(err);
        });
    }


    /**
     * 
     * @param {*} projectId 
     * @param {*} job 
     * @param {*} onResult 
     * @param {*} onError 
     */
    insertNewJobIntoProject(projectId, job, onResult, onError) {
        var promises = [];
        console.log(`saving job with price ${job.price} for project with id ${projectId}`);
        promises.push(this.executeStatement('INSERT INTO `job` (`creationDate`,`price`,`status`) VALUES (now(), ?, ?);', [job.price, 1], 'jobId', 'insertId'));
        Promise.all(promises).then((values) => {
            var jobId = _.compact(_.pluck(values, 'jobId'))[0];
            var assignments = [];
            assignments.push(this.executeStatement('INSERT INTO `assignment` (`projectId`, `jobId`) VALUES (?, ?);', [projectId, jobId], 'assignmentId', 'insertId'));
            Promise.all(assignments).then((assignmentValues) => {
                onResult(jobId);
            }).catch((err) => {
                onError(err);
            });
        }).catch((err) => {
            onError(err);
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} onResult 
     * @param {*} onError 
     */
    getProject(id, onResult, onError) {
        if (_.isUndefined(id)) {
            //getting all projects
            this.pool.query('SELECT project.id as projectId, project.title, job.id as jobId, job.creationDate, job.price, status.description FROM job INNER JOIN project INNER JOIN assignment INNER JOIN status ON assignment.projectId = project.id AND assignment.jobId = job.id AND status.idstatus = job.status order by project.id;',
                [], function (err, rows, fields) {
                    if (err) {
                        onError(err);
                    } else {
                        onResult(rows, fields);
                    }
                });
        } else {
            //getting project by id
            this.pool.query('SELECT project.id as projectId, project.title, job.id as jobId, job.creationDate, job.price, status.description FROM job INNER JOIN project INNER JOIN assignment INNER JOIN status ON assignment.projectId = project.id AND assignment.jobId = job.id AND project.id = ? AND status.idstatus = job.status order by project.id;',
                [id], function (err, rows, fields) {
                    if (err) {
                        onError(err);
                    } else {
                        onResult(rows, fields);
                    }
                });
        }
    }

    /**
     * 
     * @param {*} status 
     * @param {*} orderByCreationDate 
     * @param {*} onResult 
     * @param {*} onError 
     */
    getJobs(status, orderByCreationDate, onResult, onError) {
        if (_.isUndefined(status)) {
            var orderByDate = orderByCreationDate ? ' ORDER BY creationDate ' + orderByCreationDate : '';
            this.pool.query('SELECT job.id, job.creationDate, job.price, status.description as status FROM job INNER JOIN status where job.status = status.idstatus ' + orderByDate, function (err, rows, fields) {
                if (err) {
                    console.error(err);
                    onError(err);
                } else {
                    onResult(rows, fields);
                }
            });
        } else {
            this.pool.query('SELECT job.id, job.creationDate, job.price, status.description FROM job INNER JOIN status where status.description = ? AND status.idstatus = job.status;',
                [status],
                function (err, rows, fields) {
                    if (err) {
                        console.error(err);
                        onError(err);
                    } else {
                        onResult(rows, fields);
                    }
                });
        }
    }

    /**
     * @param {*} id 
     * @param {*} status
     * @param {*} onResult 
     * @param {*} onError
     */
    changeJobStatus(id, status, onResult, onError) {
        var self = this;
        this.pool.query('SELECT idstatus FROM status where description = ?',
            [status],
            function (err, rows, fields) {
                if (err) {
                    onError(err);
                } else {
                    self.executeStatement('UPDATE `job` SET `status` = ? WHERE `id` = ?;', [rows[0].idstatus, id], 'affectedRows', 'affectedRows').then((result) => {
                        if (result.affectedRows === 1) {
                            onResult(result.affectedRows);
                        } else {
                            onError(`No job found with id ${id}`);
                        }
                    }).catch((err) => {
                        onError(err);
                    });
                }
            });
    }

}



module.exports = { MySQLDao };