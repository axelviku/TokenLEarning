const mongoose = require('mongoose');

const iBeaconDataSchema = new mongoose.Schema({
    name: String,
    time: Date,
    battery: String,
    gatewayMac: String,
    mac: String,
    rssi: Number
})

module.exports = new mongoose.model('iBeaconData', iBeaconDataSchema);