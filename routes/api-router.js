var express = require('express');
var router = express.Router();
const { ApiService } = require("../service/api-service");
var _ = require('underscore');


const returnError = function (res, message) {
  console.error(message);
  res.status(400).send({ error: message });
}

router.post('/project/new', function (req, res, next) {
  ApiService.getInstance().insertNewProject(req, function (result) {
    res.send({ result: result });
  }, function (error) {
    returnError(res, `Error while saving project: ${error}`);
  });
});

router.post('/job/new', function (req, res, next) {
  ApiService.getInstance().insertNewJobIntoProject(req, function (result) {
    res.send({ result: result });
  },
    function (error) {
      returnError(res, `Error while saving job: ${error}`);
    });
});

router.get('/project/:id', function (req, res, next) {
  ApiService.getInstance().getProject(req, function (result) {
    res.send({ result: result });
  },
    function (error) {
      returnError(res, `Error while saving job: ${error}`);
    });
});

router.get('/projects/', function (req, res, next) {
  ApiService.getInstance().getProjects(function (result) {
    res.send({ result: result });
  },
    function (error) {
      returnError(res, `Error while saving job: ${error}`);
    });
});


router.get('/jobs', function (req, res, next) {
  ApiService.getInstance().getJobs(req, function (result) {
    res.send({ result: result });
  },
    function (error) {
      returnError(res, `Error while saving job: ${error}`);
    });
});

router.put('/job/:id', function (req, res, next) {
  ApiService.getInstance().changeJobStatus(req, function (result) {
    res.send({ result: result });
  },
    function (error) {
      returnError(res, `Error while saving job: ${error}`);
    });
});

router.get('/*', function (req, res, next) {
  returnError(res, 'Wrong API call: please check our documentation');
});

module.exports = router;
