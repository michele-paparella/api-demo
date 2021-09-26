// get the client
const mysql = require('mysql2');
var _ = require('underscore');
const { MySQLDao } = require("./mysql/mysql-dao");

class Facade {

    loadJobs(onResult) {
        // For pool initialization, see above
        new MySQLDao().loadJobs(onResult);
    }

    /**
     * creare un project che contenga un array di job (almeno uno al momento della creazione)
     */
    insertNewProject(title, jobs, onResult, onError) {
        new MySQLDao().insertNewProject(title, jobs, onResult, onError);
    }

    /**
     * aggiungere un job ad un project esistente
     */
    insertNewJobIntoProject(projectId, job, onResult, onError) {
        new MySQLDao().insertNewJobIntoProject(projectId, job, onResult, onError);
    }

}

module.exports = { Facade };