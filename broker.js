//MQTT BROKER...
var mosca = require('mosca');
var settings = { port:1883 };

var broker = new mosca.Server(settings, () => console.log("Mosca is starting..."));

broker.on('ready', setup);

function setup() {
	console.log('Mosca (Broker) server is up and running');
};

broker.on('clientConnected', function(client) {
    console.log(`Client Connected: ${client.id}`);
});

broker.on('clientDisconnected', function(client) {
    console.log(`Client Disconnected: ${client.id}`);
});

broker.on('published', function(packet, client) {
	console.log(`Message Published:\n${packet.payload}`);
});