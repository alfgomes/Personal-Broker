/*############################################################################################*/
/*## MQTT PUBLISHER                                                                         ##*/
/*## CLIENT CONFIGURATIONS                                                                  ##*/
/*############################################################################################*/
var mqtt = require('mqtt'), url = require('url');
var currentDate = require('./CurrentDate');
var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');
var url = "mqtt://" + mqtt_url.host;

var connectOptions = {
    port: mqtt_url.port,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: auth[0],
    password: auth[1],
    keepalive: 60,
    //reconnectPeriod: 2000,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: false,
    connectTimeout: 30000,
    encoding: 'utf8'
};

var messageOptions = {
    retain: true,
    qos: 1
};
  
// Create a client connection
var client = mqtt.connect(url, connectOptions);




//Topic implementation
var topic = "filter1/machine";
var message = {
    publishedID: 1,
    subscriberID: 254,
    text: "Hello World!",
    type: "welcome",
    date: ""
};

client.on('connect', () => {
    client.subscribe('error', function(err) {
        if (!err) {
          client.publish('presence', 'Hello mqtt')
        }
    });
    
    client.subscribe('client_will');

    setInterval(() => {
        message.subscriberID = new Date().getSeconds();
        message.date = currentDate.yyyymmdd_hhmmss();

        client.publish(topic, JSON.stringify(message), messageOptions);
        console.log('Message Sent:', message);

        if (message.subscriberID > 56)
            client.publish('error', 'Teste de Erro');
        
        if (message.subscriberID < 06)
            client.publish('topic2', 'Tópico 2');
    }, 5000);
});

client.on('message', function(topic, message, packet) {
    console.log(`Received '${message}' on '${topic}'`);
});

client.on('client_will', function (topic, message, packet) {
    console.log(`Subscriber will '${message}' on '${topic}'`);
});