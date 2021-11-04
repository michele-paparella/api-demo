var _ = require('underscore');
const { Facade } = require("../backend/facade");
const Joi = require('joi');

class ApiService {

    static instance;

    static getInstance() {
        if (!this.instance) {
            this.instance = new ApiService();
        }
        return this.instance;
    }

    insertNewProjectSchema = Joi.object({
        title: Joi.string()
            .min(1)
            .required(),
        jobs: Joi.array().items(
            Joi.object({
                price: Joi.number()
            })
        ).has(Joi.object({ price: Joi.number() }).required())
    });

    insertNewJobIntoProjectSchema = Joi.object({
        projectId: Joi.number(),
        job: Joi.object({
            price: Joi.number().required()
        })
    });

    updateJobStatusSchema = Joi.object({
        status: Joi.string().valid('in preparation', 'in progress', 'delivered', 'cancelled')
    });

    /**
     * 
     * @param {*} title 
     * @param {*} jobs 
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewProject(req, onResult, onError) {
        console.log('entrato')
        const { error } = this.insertNewProjectSchema.validate(req.body);
        if (error) {
            onError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        } else {
            console.log(`Request is good, saving the project ${req.body.title}`);
            Facade.getInstance().insertNewProject(req.body.title, req.body.jobs, function (id) {
                onResult(id);
            }, function (error) {
                onError(`Error while saving project: ${error}`);
            });
        }
    }

    /**
     * 
     * @param {*} projectId 
     * @param {*} job 
     * @param {*} onResult 
     * @param {*} onError
     */
    insertNewJobIntoProject(req, onResult, onError) {
        const { error } = this.insertNewJobIntoProjectSchema.validate(req.body);
        if (error) {
            onError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        } else {
            console.log(`Request is good, saving the job with price ${req.body.job.price}`);
            Facade.getInstance().insertNewJobIntoProject(req.body.projectId, req.body.job, function (id) {
                onResult(id);
            },
                function (error) {
                    onError(`Error while saving job: ${error}`);
                });
        }
    }

    /**
     * 
     * @param {*} id 
     * @param {*} onResult 
     * @param {*} onError
     */
    getProject(req, onResult, onError) {
        var id = req.params.id;
        if (_.isNaN(id) || _.isUndefined(id)) {
            onError('Please check your parameter');
        } else {
            //getting project by id
            Facade.getInstance().getProject(id, function (rows, fields) {
                if (_.isEmpty(rows)) {
                    onResult({});
                } else {
                    var result = {
                        id: rows[0].projectId,
                        title: rows[0].title,
                        jobs: []
                    };
                    for (var job of rows) {
                        result.jobs.push({
                            id: job.jobId,
                            creationDate: job.creationDate,
                            price: job.price,
                            status: job.description
                        });
                    }
                    onResult(result);
                }
            }, function (error) {
                onError(`Error while getting project: ${error}`);
            });
        }
    }

    /**
     * 
     * @param {*} onResult 
     * @param {*} onError 
     */
    getProjects(onResult, onError) {
        Facade.getInstance().getProject(undefined, function (rows, fields) {
            if (_.isEmpty(rows)) {
                onResult({});
            } else {
                var projectToJobs = {};
                for (var row of rows) {
                    if (!projectToJobs.hasOwnProperty(row.projectId)) {
                        projectToJobs[row.projectId] = {
                            projectId: row.projectId,
                            title: row.title,
                            jobs: []
                        }
                    }
                    projectToJobs[row.projectId].jobs.push(
                        {
                            id: row.jobId,
                            creationDate: row.creationDate,
                            price: row.price,
                            status: row.description
                        }
                    )
                }
                onResult(_.map(projectToJobs, function (value, key) {
                    return {
                        projectId: key,
                        title: value.title,
                        jobs: value.jobs
                    }
                }));
            }
        }, function (error) {
            onError(`Error while getting projects: ${error}`);
        });
    }

    /**
     * @param {*} status 
     * @param {*} onResult 
     * @param {*} onError
     */
    getJobs(req, onResult, onError) {
        var status = undefined;
        var orderBy = undefined;
        if (_.contains(['in preparation', 'in progress', 'delivered', 'cancelled'], req.query.status)) {
            status = req.query.status
        } else if (req.query.orderBy && (req.query.orderBy === 'asc' || req.query.orderBy === 'desc')) {
            orderBy = req.query.orderBy;
        }
        if ((req.query.status || req.query.orderBy) && _.isUndefined(status) && _.isUndefined(orderBy)) {
            onError(`Please check your parameters`);
        } else {
            Facade.getInstance().getJobs(status, orderBy, function (rows, fields) {
                onResult(rows);
            }, function (error) {
                onError(`Error while getting jobs: ${error}`);
            });
        }
    }

    /**
     * 
     * @param {*} id 
     * @param {*} status 
     * @param {*} onResult 
     * @param {*} onError
     */
    changeJobStatus(req, onResult, onError) {
        var id = req.params.id;
        if (_.isNaN(id) || _.isUndefined(id)) {
            onError(`Please check your parameter`);
        } else {
            const { error } = this.updateJobStatusSchema.validate(req.body);
            if (error) {
                onError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            } else {
                Facade.getInstance().changeJobStatus(id, req.body.status, function (id) {
                    onResult('');
                },
                    function (error) {
                        onError(`Error while updating job: ${error}`);
                    });
            }
        }
    }


}

module.exports = { ApiService };