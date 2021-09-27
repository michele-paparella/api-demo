var express = require('express');
var router = express.Router();
const { Facade } = require("../backend/facade");
const Joi = require('joi');
var _ = require('underscore');

const insertNewProjectSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .required(),
  jobs: Joi.array().items(
    Joi.object({
      price: Joi.number()
    })
  ).has(Joi.object({ price: Joi.number() }).required())
});

const insertNewJobIntoProjectSchema = Joi.object({
  projectId: Joi.number(),
  job: Joi.object({
    price: Joi.number().required()
  })
});

const updateJobStatusSchema = Joi.object({
  status: Joi.string().valid('in preparation', 'in progress', 'delivered', 'cancelled')
});

const returnError = function (res, message) {
  console.error(message);
  res.status(400).send({ error: message });
}

/**
 * creare un project che contenga un array di job (almeno uno al momento della creazione)
 */
router.post('/project/new', function (req, res, next) {
  //TODO crete connection pool only once
  const { error } = insertNewProjectSchema.validate(req.body);
  if (error) {
    returnError(res, `Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    console.log(`Request is good, saving the project ${req.body.title}`);
    Facade.getInstance().insertNewProject(req.body.title, req.body.jobs, function (id) {
      res.send(`Project ${req.body.title} has been saved with id ${id}.`);
    }, function (error) {
      returnError(res, `Error while saving project: ${error}`);
    });
  }
});

/**
 * aggiungere un job ad un project esistente
 */
router.post('/job/new', function (req, res, next) {
  //TODO crete connection pool only once
  const { error } = insertNewJobIntoProjectSchema.validate(req.body);
  if (error) {
    returnError(res, `Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    console.log(`Request is good, saving the job with price ${req.body.job.price}`);
    Facade.getInstance().insertNewJobIntoProject(req.body.projectId, req.body.job, function (id) {
      res.send(`Job has been saved with id ${id}.`);
    },
      function (error) {
        returnError(res, `Error while saving job: ${error}`);
      });
  }
});

/**
 * ottenere un project da ID (con relativi job)
 */
router.get('/project/:id', function (req, res, next) {
  //TODO crete connection pool only once
  var id = req.params.id;
  if (_.isNaN(id) || _.isUndefined(id)) {
    returnError(res, 'Please check your parameter');
  } else {
    //getting project by id
    Facade.getInstance().getProject(id, function (rows, fields) {
      if (_.isEmpty(rows)) {
        res.send({});
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
        res.send(result);
      }
    }, function (error) {
      returnError(res, `Error while getting project: ${error}`);
    });
  }
});

/**
 * ottenere tutti i project (con relativi job)
 */
router.get('/projects/', function (req, res, next) {
  //TODO crete connection pool only once
  Facade.getInstance().getProject(undefined, function (rows, fields) {
    if (_.isEmpty(rows)) {
      res.send({});
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
      res.send(_.map(projectToJobs, function (value, key) {
        return {
          projectId: key,
          title: value.title,
          jobs: value.jobs
        }
      }));
    }
  }, function (error) {
    returnError(res, `Error while getting projects: ${error}`);
  });
});

/**
 * ottenere tutti i job
 * ottenere tutti i job con uno status specifico
 * ottenere tutti i job ordinati per creationDate, asc oppure desc
 */
router.get('/jobs', function (req, res, next) {
  //TODO crete connection pool only once
  var status = undefined;
  var orderBy = undefined;
  if (_.contains(['in preparation', 'in progress', 'delivered', 'cancelled'], req.query.status)) {
    status = req.query.status
  } else if (req.query.orderBy && (req.query.orderBy === 'asc' || req.query.orderBy === 'desc')) {
    orderBy = req.query.orderBy;
  }
  if ((req.query.status || req.query.orderBy) && _.isUndefined(status) && _.isUndefined(orderBy)) {
    returnError(res, `Please check your parameters`);
  } else {
    //ottenere tutti i job
    Facade.getInstance().getJobs(status, orderBy, function (rows, fields) {
      res.send(rows);
    }, function (error) {
      returnError(res, `Error while getting jobs: ${error}`);
    });
  }
});

/**
 * modificare lo status di un job da ID
 */
router.put('/job/:id', function (req, res, next) {
  //TODO crete connection pool only once
  var id = req.params.id;
  if (_.isNaN(id) || _.isUndefined(id)) {
    returnError(res, `Please check your parameter`);
  } else {
    const { error } = updateJobStatusSchema.validate(req.body);
    if (error) {
      returnError(res, `Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
      Facade.getInstance().changeJobStatus(id, req.body.status, function (id) {
        res.send(`Job has been successfully updated.`);
      },
        function (error) {
          returnError(res, `Error while updating job: ${error}`);
        });
    }
  }
});

/**
 * ottenere un project da ID (con relativi job)
 */
router.get('/*', function (req, res, next) {
  returnError(res, 'Wrong API call: please check our documentation');
});

module.exports = router;
