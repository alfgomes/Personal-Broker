/*############################################################################################*/
/*## MQTT SUBSCRIBER                                                                        ##*/
/*## CLIENT CONFIGURATIONS                                                                  ##*/
/*############################################################################################*/
//var commanderID = 'Lampada_E74D4S8';
var slaverID = 'Lampada_E74D4S8';
/*############################################################################################*/
var mqtt = require('mqtt'), url = require('url');
var path = require('path');
var fs = require('fs');
var topicAction = require('./TopicAction');
// var KEY = fs.readFileSync(path.join(__dirname, '..', '..', 'test', 'helpers', 'tls-key.pem'));
// var CERT = fs.readFileSync(path.join(__dirname, '..', '..', 'test', 'helpers', 'tls-cert.pem'));

var currentDate = require('./CurrentDate');
var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');
var host = "mqtt://" + mqtt_url.host;

var connectOptions = {
    port: mqtt_url.port,
    clientId: slaverID,
    username: auth[0],
    password: auth[1],
    // key: KEY,
    // cert: CERT,
    rejectUnauthorized: false,
    keepalive: 3600, //Tempo máximo que o o cliente pode ficar sem enviar mensagens (0 anula)...
    reschedulePings: true,
    reconnectPeriod: 10000,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: false,
    retain: false,
    connectTimeout: 30 * 1000,
    encoding: 'utf8',
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 2,
        retain: false
    }
};
mqtt.onFailure = onFailure;
function onFailure(message) {
    console.log(message);
};
mqtt.willMessage = onWillMessage;
function onWillMessage(message) {
    console.log("ERRO DE DESCONEXÃO!");
    console.log(message);
};

var client = mqtt.connect(host, connectOptions);
/*############################################################################################*/

//Definição dos tópicos que serão subscritos...
var topic_list = [`casa/cozinha/${slaverID}/#`];

var messageOptions = {
    retain: false,
    qos: 2
};

var status = '';

//Ação de conexão ao Broker...
client.on('connect', () => {
    client.subscribe('error', function(err) {
        if (!err)
          client.publish('presence', 'Hello mqtt', messageOptions);
    });
    client.subscribe('WillMsg');
    client.subscribe(topic_list);

    console.log('Sensor has connected successfully');
});

//Definições de Leitura dos Tópicos subscritos...
client.on('message', function (topic, message, packet) {
    switch(topicAction.GetTopicActionId(topic)) {
        case 1:
            ProcessAction(topic, message);
            break;
        case 2:
            ProcessGetStatus(topic, message);
            break;
        default:
            ProcessGeneralMessages(topic, message);
    }
});

client.on('WillMsg', function (topic, message, packet) {
    console.log(`Subscriber will '${message}' on '${topic}'`);
});

client.on('error', function(error) {
    console.log(error);
    client.end();
});

client.on('offline', function(a) {
    console.log('Lost Connection!' + a);
});

client.on('close', function() {
    console.log(slaverID + ' disconnected');
});

//Methods of execution...
function ProcessAction(topic, message) {
    var actionMessage = JSON.parse(message);
    if (actionMessage.type === "command")
        if (actionMessage.action === "activation") {
            if (currentDate.ss() <= 50) //Teste para validar um erro no comando (REMOVER)
                status = actionMessage.value;
        }

    console.log(`UPDATE POWER TO [${status.toUpperCase()}]`);
}

function ProcessGetStatus(topic, message) {
    //console.log(`Received '${message}' on '${topic}'`);
    client.publish(`casa/cozinha/${slaverID}/retStatus`, JSON.stringify(status), messageOptions);
    console.log(` » Responding to the current state = ${status.toUpperCase()}\n`);
}

function ProcessGeneralMessages(topic, message) {
    //console.log(`${message}`);
}