const express = require('express');
const router = new express.Router();
const user = require('../models/user');
const MetaData = require('../models/meta-data');
const gateway = require('../models/gateway');
const card = require('../models/cardAddInfo');
const ObjectId = require('mongodb').ObjectId;

//card adding
module.exports.cardAdding = async function(req, res) {
    try {
        console.log(req.body);
        if (await card.findOne({ cardNum: req.body.cardNum })) {
            return res.send({ status: 'success', message: 'This Card is already registered' });
        } else {
            const returnData = {
                cardNum: req.body.cardNum,
                'metaData.createdAt': MetaData.dateInfo(),
                'metaData.createdBy': req.body.userId,
            }
            const Carddata = await card.create(returnData);
            res.send({ status: 'success', message: 'Card added successfully...!!!', data: Carddata });
        }
    } catch (error) {
        res.send({ message: error })
    }
}

//card update
module.exports.updateCard = async function(req, res) {
    try {
        console.log(req.body, req.params);
        const updateData = await card.findById({ _id: ObjectId(req.params._id) });
        if (updateData) {
            await card.updateOne({
                cardNum: req.body.cardNum,
                'metaData.updatedAt': MetaData.dateInfo(),
                'metaData.updatedBy': req.body.userId,
            })
            return res.send({ status: 'success', message: "Card Updated Successfully" });
        } else {
            return res.send({ status: 'success', message: "This Card is not registerd, Please register first..." });
        }
    } catch (error) {
        return res.send({ status: 'success', message: "This Card is not registerd, Please register first..." });
    }
}


//delete card
module.exports.deleteCard = async function(req, res) {
    try {
        console.log(req.params);
        const deleteData = await card.find({ '_id': ObjectId(req.params._id) })
        console.log(deleteData.length);
        if (deleteData.length === 1) {
            await card.deleteOne({ '_id': ObjectId(req.params._id) });
            return res.send({ status: 'success', message: "Card deleted Successfully" });
        } else {
            return res.send({ status: 'error', message: "This Card is not registerd or deleted already... Please check...!!!" });
        }
    } catch (error) {
        return res.send({ status: 'error', message: "This Card is not registerd or deleted already... Please check...!!!" })
    }
}