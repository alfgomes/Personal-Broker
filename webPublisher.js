var mqtt = require('mqtt');
var express = require('express');
var router = express.Router();
var events = require('events');
var eventEmitter = new events.EventEmitter();

var MQTT_TOPIC = "filter1/machine";
var MQTT_ADDR = "mqtt://localhost:1883";
var options = {
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    connectTimeout: 1000,
    debug: true
};

eventEmitter.on('mqttcall', myEventHandler);
var myEventHandler = function () {
     console.log("Event");
};

var client = mqtt.connect(MQTT_ADDR, options);

client.on('connect', function () {
  client.publish(MQTT_TOPIC, '1');
});

client.on('error', function(){
  console.log("ERROR");
});

router.get('/', (req, res) => {
  client.publish(MQTT_TOPIC, "1");
  res.send("success");
});

module.exports = router;