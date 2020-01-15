Date.prototype.yyyymmdd_hhmmss = function() {
    var mes = this.getMonth() + 1;
    var dia = this.getDate();
    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();
  
    return [
            this.getFullYear(),
            '-',
            (mes > 9 ? '' : '0') + mes,
            '-',
            (dia > 9 ? '' : '0') + dia,
            '_',
            (hh > 9 ? '' : '0') + hh,
            ':',
            (mm > 9 ? '' : '0') + mm,
            ':',
            (ss > 9 ? '' : '0') + ss
           ].join('');
};

//MQTT PUBLISHER...
var mqtt = require('mqtt'), url = require('url');
var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');
var url = "mqtt://" + mqtt_url.host;

var options = {
    port: mqtt_url.port,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: auth[0],
    password: auth[1],
    keepalive: 60,
    //reconnectPeriod: 2000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

var messageOptions = {
    retain: true,
    qos: 1
};
  
// Create a client connection
var client = mqtt.connect(url, options);




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
    client.subscribe('error', function() {
        // client.on('message', function(topic, message, packet) {
        //     console.log(`Received '${message}' on '${topic}'`);
        // });
    });

    setInterval(() => {
        message.subscriberID = new Date().getSeconds();
        message.date = new Date().yyyymmdd_hhmmss();

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