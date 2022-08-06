var express = require("express");
var router = express.Router();


const reg = require('./controller/user-Controller');


const auth = require("./auth");

//Registration and login process
router.post('/user/registration', reg.registration);
router.post('/user/login', reg.login);
router.post("/user/sendOtp", reg.send_otp);
router.post("/user/forgetPass", reg.forgetPass);



module.exports = router;
