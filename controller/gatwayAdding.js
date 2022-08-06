const express = require('express');
const router = new express.Router();
const user = require('../models/user');
const MetaData = require('../models/meta-data');
const gateway = require('../models/gateway');
const ObjectId = require('mongodb').ObjectId;

//Adding gateway
module.exports.addingGatway = async function(req, res) {
    try {
        console.log(req.body);
        if (await gateway.findOne({ gatewayNum: req.body.gatewayNum })) {
            return res.send({ status: 'success', message: 'This gateway is already registered' });
        } else {
            const returnData = {
                gatwayNum: req.body.gatwayNum,
                lat: req.body.lat,
                lng: req.body.lng,
                'metaData.createdAt': MetaData.dateInfo(),
                'metaData.createdBy': req.body.userId,
            }
            const gatewaydata = await gateway.create(returnData);
            res.send({ status: 'success', message: 'Gatway added successfully...!!!', data: gatewaydata });
        }
    } catch (error) {
        res.send(error)
    }
}

//Update gateway
module.exports.updateGateway = async function(req, res) {
    try {
        console.log(req.body, req.params);
        const updateData = await gateway.findById({ _id: ObjectId(req.params._id) });
        if (updateData) {
            await gateway.updateOne({
                gatwayNum: req.body.gatwayNum,
                lat: req.body.lat,
                lng: req.body.lng,
                'metaData.updatedAt': MetaData.dateInfo(),
                'metaData.updatedBy': req.body.userId,
            })
            return res.send({ status: 'success', message: "Gateway Updated Successfully" });
        } else {
            return res.send({ status: 'success', message: "This Gateway is not registerd, Please register first..." });
        }
    } catch (error) {
        return res.send({ status: 'error', message: "This Gateway is not registerd, Please register first..." })
    }
}

//Delete GateWay
module.exports.deleteGateway = async function(req, res) {
    try {
        const deleteData = await gateway.find({ '_id': ObjectId(req.params._id) })
        console.log(deleteData, deleteData.length);
        if (deleteData.length === 1) {
            await gateway.deleteOne({ '_id': ObjectId(req.params._id) });
            return res.send({ status: 'success', message: "Gateway deleted Successfully" });
        } else {
            return res.send({ status: 'success', message: "This Gateway is not registerd or deleted already... Please check...!!!" });
        }
    } catch (error) {
        return res.send({ status: 'error', message: error });
    }
}