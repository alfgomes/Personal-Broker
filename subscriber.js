//MQTT SUBSCRIBER...
var mqtt = require('mqtt'), url = require('url');
var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');
var url = "mqtt://" + mqtt_url.host;

var options = {
    port: mqtt_url.port,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: auth[0],
    password: auth[1],
    protocolId: 'MQIsdp',
    encoding: 'utf8',
    onFailure: onFailure
};

mqtt.onFailure = onFailure;

function onFailure(message) {
    console.log(message);
}


// Create a client connection
var client = mqtt.connect(url, options);




//Topic implementation
var topic = "filter1/machine";
var topic_list=["filter1/machine","topic2","topic3","topic4"];

client.on('connect', function () {
    client.subscribe(topic_list);
    console.log('client has subscribed successfully');
});

client.on('message', function (topic, message, packet) {
    console.log(`Received '${message}' on '${topic}'`);

    if (topic === 'filter1/machine') {
        var context = JSON.parse(message);
        if (context.subscriberID == 20) {
            console.log('Hi, it\'s me!');
            console.log(context);
        }
    }
});

client.on('error', function(error) {
    console.log(error);
    client.end();
});