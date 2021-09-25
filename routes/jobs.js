var express = require('express');
var router = express.Router();
const { Facade } = require("../backend/facade");

/* GET jobs listing. */
router.get('/', function (req, res, next) {
  //TODO crete connection pool only once
  new Facade().loadJobs(function (rows, fields) {
    res.send(rows);
  }
  );
});

module.exports = router;
