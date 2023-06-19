var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/host/api/Esp32', function (req, res, next) {
    res.json({
        "tempReq": 10,
        "connectionConfig": 2,
        "coonectionReq": 30
    })
});

router.put('/host/api/Esp32', express.json(), function (req, res, next) {
    console.log(req.body);
    res.json({
        "tempReq": 10,
        "connectionConfig": 2,
        "coonectionReq": 30
    })
});

module.exports = router;
