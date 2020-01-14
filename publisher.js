//MQTT PUBLISHER...
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1234')

var topic = 'myTopic'
var message = 'Hello World!'

client.on('connect', () => {
    setInterval(() => {
        client.publish(topic, message)
        console.log('Message Sent:', message)
    }, 5000);
})