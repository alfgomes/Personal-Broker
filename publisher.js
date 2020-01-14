Date.prototype.yyyymmdd_hhmmss = function() {
    var mes = this.getMonth() + 1
    var dia = this.getDate()

    var hh = this.getHours()
    var mm = this.getMinutes()
    var ss = this.getSeconds()
  
    return [
            this.getFullYear(),
            '-',
            (mes > 9 ? '' : '0') + mes,
            '-',
            (dia > 9 ? '' : '0') + dia,
            ' ',
            (hh > 9 ? '' : '0') + hh,
            ':',
            (mm > 9 ? '' : '0') + mm,
            ':',
            (ss > 9 ? '' : '0') + ss
           ].join('');
};

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    return "".concat(yyyy).concat(mm).concat(dd);
};
  
Date.prototype.yyyymmddhhmm = function() {
    var yyyymmdd = this.yyyymmdd();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    return "".concat(yyyymmdd).concat(hh).concat(min);
};

Date.prototype.yyyymmddhhmmss = function() {
    var yyyymmddhhmm = this.yyyymmddhhmm();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    return "".concat(yyyymmddhhmm).concat(ss);
};



//MQTT PUBLISHER...
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1234')

var topic = 'myTopic'
var message = 'Hello World!'

client.on('connect', () => {
    setInterval(() => {
        var date = new Date();
        var temp_message = message + ' ' + date.yyyymmdd_hhmmss();

        client.publish(topic, temp_message)
        console.log('Message Sent:', temp_message)
    }, 5000);
})