/*############################################################################################*/
/*## MQTT PUBLISHER                                                                         ##*/
/*## CLIENT CONFIGURATIONS                                                                  ##*/
/*############################################################################################*/
var commanderID = 'Interruptor_FER984F';
var slaverID = 'Lampada_E74D4S8';
/*############################################################################################*/
var mqtt = require('mqtt'), url = require('url');
var path = require('path');
var fs = require('fs');
var topicAction = require('./TopicAction');
// var KEY = fs.readFileSync(path.join(__dirname, '..', '..', 'test', 'helpers', 'tls-key.pem'));
// var CERT = fs.readFileSync(path.join(__dirname, '..', '..', 'test', 'helpers', 'tls-cert.pem'));

var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');
var host = "mqtt://" + mqtt_url.host;

var connectOptions = {
    port: mqtt_url.port,
    clientId: commanderID,
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
var topic_list = [`casa/cozinha/${slaverID}/retStatus`];

//Definição do objeto de mensagem a ser enviado...
var message = {
    type    : "command",
    action  : "activation",
    value   : "On"
};

var messageOptions = {
    retain: false,
    qos: 2
};

var ativar = false;

//Ação de conexão ao Broker...
client.on('connect', () => {
    client.subscribe('error', function(err) {
        if (!err)
          client.publish('presence', 'Hello mqtt', messageOptions);
    });
    client.subscribe('WillMsg');
    client.subscribe(`casa/cozinha/${slaverID}/retStatus`);

    setInterval(() => {
        ativar = !ativar; //Executar a inversão para testes...
        ActivateDevice(ativar);
        console.log('Message Sent:', message);

        RequestStatus();
    }, 5000);
        
    console.log('Switch has connected successfully');
});

function ActivateDevice(activate) {
    if (activate === true)
        message.value = 'on';
    else
        message.value = 'off';
    
    client.publish(`casa/cozinha/${slaverID}/action`, JSON.stringify(message), messageOptions);
    console.log(`COMMAND POWER TO [${message.value.toUpperCase()}]`);
};

function RequestStatus() {
    client.publish(`casa/cozinha/${slaverID}/getStatus`, '', messageOptions);
};



//Definições de Leitura dos Tópicos subscritos...
client.on('message', function(topic, message, packet) {
    switch(topicAction.GetTopicActionId(topic)) {
        case 3:
            ProcessSetStatus(topic, message);
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
function ProcessSetStatus(topic, message) {
    console.log(` » ACTUAL STATUS IN ${slaverID} IS ${message.toString().toUpperCase()}\n`);
}

function ProcessGeneralMessages(topic, message) {
    console.log(`Received '${message}' on '${topic}'`);
}