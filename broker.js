//MQTT BROKER...
var mosca = require('mosca')
var settings = { port:1234 }

var broker = new mosca.Server(settings, () => console.log("Mosca ready!"))

broker.on('ready', function() {
	console.log("Broker is ready!")
})

broker.on('published', (packet) => {
	console.log(packet.payload.toString())
})