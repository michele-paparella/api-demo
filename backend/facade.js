// get the client
const mysql = require('mysql2');
var _ = require('underscore');
const { MySQLDao } = require("./mysql/mysql-dao");

class Facade {

    /**
     * creare un project che contenga un array di job (almeno uno al momento della creazione)
     * @param {*} title 
     * @param {*} jobs 
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewProject(title, jobs, onResult, onError) {
        new MySQLDao().insertNewProject(title, jobs, onResult, onError);
    }

    /**
     * aggiungere un job ad un project esistente
     * @param {*} projectId 
     * @param {*} job 
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewJobIntoProject(projectId, job, onResult, onError) {
        new MySQLDao().insertNewJobIntoProject(projectId, job, onResult, onError);
    }

    /**
     * ottenere un project da ID (con relativi job)
     * @param {*} id 
     * @param {*} onResult 
     * @param {*} onError
     */
    getProject(id, onResult, onError) {
        new MySQLDao().getProject(id, onResult, onError);
    }

    /**
     * ottenere tutti i job
     * ottenere tutti i job con uno status specifico
     * ottenere tutti i job ordinati per creationDate, asc oppure desc
     * @param {*} status 
     * @param {*} onResult 
     * @param {*} onError
     */
    getJobs(status, orderByCreationDate, onResult, onError) {
        // For pool initialization, see above
        new MySQLDao().getJobs(status, orderByCreationDate, onResult, onError);
    }

    /**
     * modificare lo status di un job da ID
     * @param {*} id 
     * @param {*} status 
     * @param {*} onResult 
     * @param {*} onError
     */
    changeJobStatus(id, status, onResult, onError) {
        // For pool initialization, see above
        new MySQLDao().changeJobStatus(id, status, onResult, onError);
    }


}

module.exports = { Facade };