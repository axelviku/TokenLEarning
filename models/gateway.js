var mongoose = require('mongoose');
var MetaData = require('./meta-data')
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const gatewaySchema = new mongoose.Schema({
    gatwayNum: String,
    lat: Number,
    lng: Number,
    metaData: MetaData.schema
})

module.exports = new mongoose.model('gateway', gatewaySchema);