//MQTT SUBSCRIBER...
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1234')

var topic = 'myTopic'

client.on('connect', function () {
    client.subscribe(topic)
    console.log('client has subscribed successfully')
})

client.on('message', function (topic, message) {
    context = message.toString()
    console.log(context)
})