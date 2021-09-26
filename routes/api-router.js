var express = require('express');
var router = express.Router();
const { Facade } = require("../backend/facade");
const Joi = require('joi');

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
      res.send(`Error while saving project: ${error}`);
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
        res.send(`Error while saving job: ${error}`);
      });
  }
});

/**
 * ottenere un project da ID (con relativi job)
 */
router.get('/project/:id', function (req, res, next) {
  //TODO crete connection pool only once
  var id = req.params.id;
  new Facade().getProject(id, function (rows, fields) {
    var result = {
      project: {
        id: rows[0].projectId,
        title: rows[0].title
      },
      jobs: []
    };
    for (var job of rows){
      result.jobs.push({
        id: job.jobId,
        creationDate: job.creationDate,
        price: job.price,
        status: job.description
      });
    }
    res.send(result);
  }, function (error) {
    res.send(`Error while getting project: ${error}`);
  })
});

/**
 * ottenere tutti i job
 */
router.get('/jobs', function (req, res, next) {
  //TODO crete connection pool only once
  new Facade().getJobs(function (rows, fields) {
    res.send(rows);
  }, function (error) {
    res.send(`Error while getting project: ${error}`);
  })
});

module.exports = router;
