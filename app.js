var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cron = require("node-cron");
const mqtt = require('mqtt')


var indexRouter = require('./routes/index');
var getRouter = require('./routes/dataRoute');
const mongoose = require('mongoose');
var app = express();
const uri = "mongodb+srv://root:<password>@chat.jwulqqc.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect('mongodb+srv://esp32cautela:cderootcde@esp32.9wqxzf7.mongodb.net/datas?retryWrites=true&w=majority&authSource=admin');

const LorawanData = getRouter.LorawanData;



const protocol = 'mqtt'
const host = "broker.hivemq.com"
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const client = mqtt.connect(`${protocol}://${host}:${port}`, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})

const topic = '/ynov/esp32-CAUT/in/+'

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})

client.on('message', (topic, payload) => {
  const decoded = JSON.parse(payload.toString());
  console.log('Received Message:', topic, decoded);
  const n = topic.split('/');
  getRouter.addTemperatures(n[n.length - 1], decoded.temperatures, decoded.config.tempFreq);
})


async function getDataLorawan(after) {
  console.log("after",after)
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



cron.schedule('0 */20 * * * *', async () => {
  console.log('cron data');
  var query;
  try {
    query = await LorawanData.findOne({}, {}, { sort: { 'timestamp': -1 } });
  } catch (e) {
    console.log(e)
  }
  console.log("Get after : ", query != null ? new Date(query.timestamp.getTime() + 1) : new Date(Date.now() - (1000 * 60 * 60 * 24)));
  var query = await getDataLorawan(query != null ? new Date(query.timestamp.getTime() + 1) : new Date(Date.now() - (1000 * 60 * 60 * 24)));
  console.log(query.length);
  LorawanData.create(query).then(() => console.log("fetch !")).catch((r) => console.error(r));
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(getRouter.router)
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
