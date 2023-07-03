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
            params: { after: after }
        });
    console.log("data :", response.data);
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

router.get('/getMeasures/:name?', async function (req, res, next) {
    var stuff = [
        {
            temperature: 38,
            timestamp: '2023-07-03T09:10:55.736Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:11:05.736Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:11:20.762Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:11:30.762Z',

        },
        {
            temperature: 38,
            timestamp: '2023-07-03T09:11:41.039Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:11:51.039Z',

        },
        {
            temperature: 38,
            timestamp: '2023-07-03T09:12:01.212Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:12:11.212Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:12:24.269Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:12:34.269Z',

        },
        {
            temperature: 38,
            timestamp: '2023-07-03T09:12:44.561Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:12:54.561Z',

        },
        {
            temperature: 39,
            timestamp: '2023-07-03T09:13:34.809Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:13:44.809Z',

        },
        {
            temperature: 37,
            timestamp: '2023-07-03T09:13:55.420Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:14:05.420Z',

        },
        {
            temperature: 38,
            timestamp: '2023-07-03T09:14:20.854Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:14:30.854Z',

        },
        {
            temperature: 39,
            timestamp: '2023-07-03T09:14:41.371Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:14:51.371Z',

        },
        {
            temperature: 39,
            timestamp: '2023-07-03T09:15:01.760Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:15:11.760Z',

        },
        {
            temperature: 38,
            timestamp: '2023-07-03T09:15:25.126Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:15:35.126Z',

        },
        {
            temperature: 37,
            timestamp: '2023-07-03T09:15:48.165Z',

        },
        {
            temperature: 36,
            timestamp: '2023-07-03T09:15:58.165Z',

        }];
    res.render('graph', { stuff: JSON.stringify(stuff) });
});

exports.router = router;
