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
    config : {
        tempFreq: {type:Number,default:10},
        connectionConfig: {type:Number,default:1},
        connectionFreq: {type:Number,default:30},
    }
});
const LorawanData = mongoose.model('LorawanData', { measures: { conduct_SOIL: Number, temp_SOIL: Number, water_SOIL: Number }, timestamp: { type: Date, unique: true }, },);
exports.LorawanData = LorawanData;

router.put("/putConfigEsp32/:name?", async function (req, res, next) {
    await Esp32Data.findOneAndUpdate({name:req.params.name},{config:req.body}).exec();
    res.sendStatus(200);
});

router.get("/getConfigEsp32/:name?", async function (req, res, next) {

    const c = (await Esp32Data.findOne({name:req.params.name},"config").exec());

    if(c != null){
        res.json(c.config);
    }else{
        res.sendStatus(400);
    }
    
});

function addTemperatures(name, temperaturesRaw, freq) {
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
    Esp32Data.findOneAndUpdate({ name: name }, { $push: { temperatures: temperatures } }, { upsert: true },).exec();
}

exports.addTemperatures = addTemperatures

router.put("/addTempEsp32/:name?", express.json(), function (req, res, next) {
    console.log(`For ${req.params.name} : [` + req.body.temperatures + "]");
    addTemperatures(req.params.name, req.body.temperatures, req.body.config.tempFreq);
    res.status(200).send();
});

router.get('/getLorawanGraph', async function (res, res, next) {
    var stuff = (await LorawanData.find().exec());
    res.render('graphLora', { stuff: JSON.stringify(stuff) });
});

router.get('/getEsp32Graph/:name', async function (req, res, next) {
    var stuff = (await Esp32Data.findOne({ name: req.params.name }).exec()).temperatures.filter((tempObj => tempObj.timestamp >= (new Date(Date.now() - 1000*60*60*24)))).map((value) => {
        delete value._id;
        return value;
    });
    res.render('graph', { stuff: JSON.stringify(stuff) });
});

exports.router = router;
