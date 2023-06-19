var express = require('express');
var router = express.Router();

var parameters = {
    "tempFreq": 10,
    "connectionConfig": 2,
    "connectionFreq": 30
}


/* GET home page. */
router.get('/host/api/Esp32/:name?', function (req, res, next) {
    res.json(parameters)
});

router.put('/host/api/Esp32/:name?', express.json(), function (req, res, next) {
    console.log(`For ${req.params.name} : [` + req.body.temperatures + ']');
    res.json(parameters)
});

module.exports = router;
