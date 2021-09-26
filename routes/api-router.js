var express = require('express');
var router = express.Router();
const { Facade } = require("../backend/facade");
const Joi = require('joi');
var _ = require('underscore');

const insertNewProjectSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(30)
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

/**
 * creare un project che contenga un array di job (almeno uno al momento della creazione)
 */
router.post('/project/new', function (req, res, next) {
  //TODO crete connection pool only once
  const { error } = insertNewProjectSchema.validate(req.body);
  if (error) {
    res.send(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    console.log(`Request is good, saving the project ${req.body.title}`);
    new Facade().insertNewProject(req.body.title, req.body.jobs, function (id) {
      res.send(`Project ${req.body.title} has been saved with id ${id}.`);
    }, function (error) {
      res.send({ error: `Error while saving project: ${error}` });
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
    res.send(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    console.log(`Request is good, saving the job with price ${req.body.job.price}`);
    new Facade().insertNewJobIntoProject(req.body.projectId, req.body.job, function (id) {
      res.send(`Job has been saved with id ${id}.`);
    },
      function (error) {
        res.send({ error: `Error while saving job: ${error}` });
      });
  }
});

/**
 * ottenere un project da ID (con relativi job)
 */
router.get('/project/:id', function (req, res, next) {
  //TODO crete connection pool only once
  var id = req.params.id;
  console.log(id)
  if (_.isNaN(id) || _.isUndefined(id)) {
    res.send({ error: 'Please check your parameter' });
  } else {
    //getting project by id
    new Facade().getProject(id, function (rows, fields) {
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
      res.send({ error: `Error while getting project: ${error}` });
    });
  }
});

/**
 * ottenere tutti i project (con relativi job)
 */
router.get('/projects/', function (req, res, next) {
  //TODO crete connection pool only once
  new Facade().getProject(undefined, function (rows, fields) {
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
    res.send({ error: `Error while getting projects: ${error}` });
  });
});

/**
 * ottenere tutti i job
 */
router.get('/jobs', function (req, res, next) {
  //TODO crete connection pool only once
  new Facade().getJobs(function (rows, fields) {
    res.send(rows);
  }, function (error) {
    res.send({ error: `Error while getting project: ${error}` });
  })
});

/**
 * ottenere un project da ID (con relativi job)
 */
router.get('/*', function (req, res, next) {
  res.send({ error: 'Wrong API call: please check our documentation' });
});

module.exports = router;
