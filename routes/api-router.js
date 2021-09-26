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

/* GET jobs listing. */
router.get('/jobs', function (req, res, next) {
  //TODO crete connection pool only once
  new Facade().loadJobs(function (rows, fields) {
    res.send(rows);
  }
  );
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
    console.log(`Request is good, saving the project ${req.body.title}`);
    new Facade().insertNewJobIntoProject(req.body.projectId, req.body.job, function (id) {
      res.send(`Job has been saved with id ${id}.`);
    },
      function (error) {
        res.send(`Error while saving job: ${error}`);
      });
  }
});

module.exports = router;
