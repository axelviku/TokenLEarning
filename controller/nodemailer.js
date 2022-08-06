const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const ejs = require('ejs')
var Template = path.join(__dirname, "../public/msg.ejs");



var main = (to_mail, sub, msg) => {
    const testAccount = nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: 'vikrant.kumar@aryavratinfotech.com',
            pass: 'Vikrant@12345'
        }
    });

    ejs.renderFile(Template, { msg: msg }, 'utf8', function(err, data) {
        console.log("OTP:-", msg);
        if (err) {
            return console.log(err);
        } else {
            var mainOptions = ({
                from: '"Vikrant Kumar" <vikrant.kumar@aryavratinfotech.com>',
                to: `${to_mail}`,
                subject: `${sub}`,
                html: `${data}`
            });
            transporter.sendMail(mainOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
}


module.exports = main;