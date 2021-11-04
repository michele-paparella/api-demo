const mysql = require('mysql2');
var _ = require('underscore');
const { MySQLDao } = require("./mysql/mysql-dao");

class Facade {

    static instance;

    static getInstance(){
        if (!this.instance){
            this.instance = new Facade();
        }
        return this.instance;
    }
    /**
     * 
     * @param {*} title 
     * @param {*} jobs 
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewProject(title, jobs, onResult, onError) {
        MySQLDao.getInstance().insertNewProject(title, jobs, onResult, onError);
    }

    /**
     * 
     * @param {*} projectId 
     * @param {*} job 
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewJobIntoProject(projectId, job, onResult, onError) {
        MySQLDao.getInstance().insertNewJobIntoProject(projectId, job, onResult, onError);
    }

    /**
     * 
     * @param {*} id 
     * @param {*} onResult 
     * @param {*} onError
     */
    getProject(id, onResult, onError) {
        MySQLDao.getInstance().getProject(id, onResult, onError);
    }

    /**
     * 
     * @param {*} status 
     * @param {*} onResult 
     * @param {*} onError
     */
    getJobs(status, orderByCreationDate, onResult, onError) {
        MySQLDao.getInstance().getJobs(status, orderByCreationDate, onResult, onError);
    }

    /**
     * 
     * @param {*} id 
     * @param {*} status 
     * @param {*} onResult 
     * @param {*} onError
     */
    changeJobStatus(id, status, onResult, onError) {
        MySQLDao.getInstance().changeJobStatus(id, status, onResult, onError);
    }

}

module.exports = { Facade };