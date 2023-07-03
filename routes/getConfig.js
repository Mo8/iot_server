const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const Esp32Data = mongoose.model("Esp32Data", {
  name: { type: String, unique: true },
  temperatures: [
    {
      temperature: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

var parameters = {
  tempFreq: 10,
  connectionConfig: 1,
  connectionFreq: 20,
};

exports.getData = async function getData(after) {
  const response = await axios.get(
    "https://eu1.cloud.thethings.network/api/v3/as/applications/soulmbengue-app-lorawansrv-1/packages/storage/uplink_message",
    {
      headers: {
        Authorization:
          "Bearer NNSXS.AFXIMSE6QXHFGBFXSYHMQQ6XFXJKDAOKRNFGHHI.N4WWBDZ7B7TNJA4IKJ6DGZAS6PNSRQBXZSWPFZT5ZSON52NGJW2A",
      },
      params: { after: after },
    }
  );
  console.log("data :", response.data);
  const ans =
    "[" +
    response.data.replaceAll(/\{\"result\"/g, ',{"result"').substring(1) +
    "]";
  var j = JSON.parse(ans).map((r) => r.result);
  j = j.filter((r) => r.end_device_ids["device_id"] == "eui-a8404194a1875ff3");
  j = j.map((r) => {
    return {
      measures: {
        conduct_SOIL: r.uplink_message.decoded_payload.conduct_SOIL,
        temp_SOIL: r.uplink_message.decoded_payload.temp_SOIL,
        water_SOIL: r.uplink_message.decoded_payload.water_SOIL,
      },
      timestamp: r.received_at,
    };
  });
  console.log(j);
  return j;
};

/* GET home page. */
router.get("/host/api/Esp32/:name?", function (req, res, next) {
  res.json(parameters);
});

 function addTemperatures(name,temperaturesRaw,freq){
    const temperatures = [];
  for (let i = 0; i < temperaturesRaw.length; i++) {
    temperatures.push({
      temperature: temperaturesRaw[i],
      timestamp: new Date(
        new Date(
          Date.now() -
            1000 * freq * (temperaturesRaw.length - i)
        )
      )
    });
  }
  Esp32Data.findOneAndUpdate({ name: name }, { $push: { temperatures:temperatures } },{upsert: true},).exec();
}

exports.addTemperatures = addTemperatures

router.put("/host/api/Esp32/:name?", express.json(), function (req, res, next) {
  console.log(`For ${req.params.name} : [` + req.body.temperatures + "]");
  addTemperatures(req.params.name,req.body.temperatures,req.body.config.tempFreq);
  res.json(parameters);
});

router.get("/getMeasures", async function (req, res, next) {
  // TODO
});

exports.router = router;
