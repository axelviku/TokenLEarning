var express = require("express");
var router = express.Router();

const webs = require('./controller/Websocket');
const reg = require('./controller/user-Controller');
const gatewayData = require('./controller/gatwayAdding');
const cardData = require('./controller/cardAdding');
const auth = require("./auth");

//Registration and login process
router.post('/user/registration', reg.registration);
router.post('/user/login', reg.login);
router.post("/user/sendOtp", reg.send_otp);
router.post("/user/forgetPass", reg.forgetPass);

//raw data send
router.post('/user/gatwarRssiData', webs.gatewayData);
//Adding gateway
router.post('/user/gateWay', auth, gatewayData.addingGatway);
//update gatway
router.post('/user/updateGateway/:_id', gatewayData.updateGateway);
//convert rssi to lat lng
router.post('/calculate', webs.WebSocketsApi2);
router.post('/calculatee', webs.WebSocketsApi3);
//Saving data once in db
router.post('/user/savingData', webs.BLE);
//delete gateway
router.post('/user/delete-gateway/:_id', gatewayData.deleteGateway);
//adding card
router.post('/user/card', cardData.cardAdding);
//update card
router.post('/user/updateCard/:_id', cardData.updateCard);
//delete card
router.post('/user/DeleteCard/:_id', cardData.deleteCard);


module.exports = router;