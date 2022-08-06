const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParsar = require("cookie-parser");
const user = require('../models/user');
const MetaData = require('../models/meta-data');
const main = require("./nodemailer");




module.exports.registration = async function(req, res) {
    try {
        console.log(req.body);
        if (await user.findOne({ email: req.body.email })) {
            return res.send({ status: 'success', message: 'This email is already register' });
        } else {
            const pass = req.body.password
            const salt = bcrypt.genSaltSync(5);
            const hash = bcrypt.hashSync(pass, salt);
            const returnData = new user({
                userName: req.body.name,
                email: req.body.email,
                mobile: req.body.phone,
                password: hash,
                'metaData.createdAt': MetaData.dateInfo()
            });
            const token = await returnData.generateAuthToken();
            console.log("token part" + token);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 10000),
                httpOnly: true
            });

            const userData = await returnData.save();
            return res.send({ status: "success", message: "Registration successfully done..!!!", data: { userData, token } })
        }
    } catch (error) {
        return res.send({ status: "error", message: error.message })
    }
}

module.exports.login = async function(req, res) {
        try {
            console.log(req.body);
            const email1 = req.body.email;
            const pass1 = req.body.password;
            try {
                const data = await user.findOne({ email: email1 });
                console.log(data);
                const isMatch = await bcrypt.compareSync(pass1, data.password);
                console.log("iiiii");
                const token = await data.generateAuthToken();
                console.log("token part" + token);

                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 300000),
                    // secure:true,
                    httpOnly: true
                });
                console.log(isMatch, 'isMatch');
                if (isMatch) {
                    console.log("after match");
                    res.send({ status: 'success', message: "Login Successfully...!!!", data: { data, token } });
                } else {
                    console.log("hit");
                    res.send({ status: 'error', message: "Email and Password Invalid...88!!!" });
                }
            } catch (err) {
                res.send({ status: 'error', message: "Email and Password Invalid...!!!" });
            }
        } catch (error) {
            res.send({ status: 'error', message: error });
        }
    }
    // forget_Pass = module.exports;
var email1;
var otp_message;
module.exports.send_otp = async(req, res) => {
    var data;
    console.log(req.body);
    try {
        email1 = req.body.email;
        console.log("h");
        if (data = await user.findOne({ email: email1 })) {
            otp_message = genRand(4);
            (main(email1, "OTP", otp_message));
            res.send({ message: "Otp Sent Successfully to Your given mail Id", otp_message });
        } else {
            res.send({ status: 'error', message: "Enter valid email" });
        }
    } catch (err) {
        res.send({ status: 'error', message: err });
    }
};
module.exports.forgetPass = async(req, res) => {
    try {
        console.log(req.body);
        const otp1 = req.body.otp;
        const pass1 = req.body.password;
        // console.log(otp_message, otp1, `${otp_message}` === otp1);
        if (`${otp_message}` === otp1) {
            const salt = bcrypt.genSaltSync(5);
            const hash = bcrypt.hashSync(pass1, salt);
            const updateData = await user.findOneAndUpdate({ email: `${email1}` }, { $set: { password: hash } }, { new: true, useFindAndModify: false });
            res.send({ message: "Password Update Successfull", updateData });
        } else {
            res.send({ status: 'error', message: "Enter valid Otp" });
        }
    } catch (err) {
        res.send({ status: 'error', message: err });
    }
};
//function to generate random 4 digit number
const genRand = (len) => {
    return Math.random().toString(10).substring(2, len + 2);
}