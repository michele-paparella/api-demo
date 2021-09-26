// get the client
const mysql = require('mysql2');
var _ = require('underscore');
const { MySQLDao } = require("./mysql/mysql-dao");

class Facade {

    /**
     * creare un project che contenga un array di job (almeno uno al momento della creazione)
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewProject(title, jobs, onResult, onError) {
        new MySQLDao().insertNewProject(title, jobs, onResult, onError);
    }

    /**
     * aggiungere un job ad un project esistente
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewJobIntoProject(projectId, job, onResult, onError) {
        new MySQLDao().insertNewJobIntoProject(projectId, job, onResult, onError);
    }

    /**
     * ottenere un project da ID (con relativi job)
     * @param {*} onResult 
     * @param {*} onError
     */
    getProject(id = undefined, onResult, onError) {
        new MySQLDao().getProject(id, onResult, onError);
    }

    /**
     * ottenere tutti i job
     * @param {*} onResult 
     * @param {*} onError
     */
    getJobs(onResult, onError) {
        // For pool initialization, see above
        new MySQLDao().getJobs(onResult, onError);
    }

}

module.exports = { Facade };