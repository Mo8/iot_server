const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

var parameters = {
    "tempFreq": 10,
    "connectionConfig": 2,
    "connectionFreq": 30
}

exports.getData = async function getData(after) {
    const response = await axios.get("https://eu1.cloud.thethings.network/api/v3/as/applications/soulmbengue-app-lorawansrv-1/packages/storage/uplink_message",
        {
            headers: { Authorization: "Bearer NNSXS.AFXIMSE6QXHFGBFXSYHMQQ6XFXJKDAOKRNFGHHI.N4WWBDZ7B7TNJA4IKJ6DGZAS6PNSRQBXZSWPFZT5ZSON52NGJW2A" },
            params: { after: after}
        });
    console.log("data :" ,response.data);
    const ans = "[" + response.data.replaceAll(/\{\"result\"/g, ",{\"result\"").substring(1) + "]"
    var j = JSON.parse(ans).map(r => r.result);
    j = j.filter(r => r.end_device_ids["device_id"] == "eui-a8404194a1875ff3")
    j = j.map(r => {
        return {
            'measures': {
                'conduct_SOIL': r.uplink_message.decoded_payload.conduct_SOIL,
                'temp_SOIL': r.uplink_message.decoded_payload.temp_SOIL,
                'water_SOIL': r.uplink_message.decoded_payload.water_SOIL
            },
            'timestamp': r.received_at
        }
    }
    )
    console.log(j)
    return j;
}



/* GET home page. */
router.get('/host/api/Esp32/:name?', function (req, res, next) {
    res.json(parameters)
});

router.put('/host/api/Esp32/:name?', express.json(), function (req, res, next) {
    console.log(`For ${req.params.name} : [` + req.body.temperatures + ']');
    res.json(parameters)
});

router.get('/getMeasures', async function (req, res, next) {
   // TODO
});

exports.router = router;
