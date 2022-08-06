const mongoose = require('mongoose');
const MetaData = require('./meta-data')
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const cardSchema = new mongoose.Schema({
    metaData: MetaData.schema,
    gatewayMac: String,
    cardNum: String,
})

module.exports = new mongoose.model('card', cardSchema);