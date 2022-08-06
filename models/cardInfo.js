const mongoose = require('mongoose');
const MetaData = require('./meta-data')
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const cardDataSchema = new mongoose.Schema({
    metaData: MetaData.schema,
    gatewayMac: String,
    mac: String,
    lat: Number,
    lng: Number,
    latitude: Number,
    longitude: Number,
    name: String
})

module.exports = new mongoose.model('cardData', cardDataSchema);