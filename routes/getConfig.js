var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/host/api/Esp32', function (req, res, next) {
    res.json({
        "tempReq": 10,
        "connectionConfig": 2,
        "connectionFreq": 30
    })
});

router.put('/host/api/Esp32', express.json(), function (req, res, next) {
    console.log(req.body.temperatures);
    res.json({
        "tempReq": req.body.config.tempReq,
        "connectionConfig": req.body.config.connectionConfig,
        "connectionFreq": req.body.config.connectionFreq
    })
});

module.exports = router;
