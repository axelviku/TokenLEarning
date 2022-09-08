const jwt = require('jsonwebtoken');
var user = require('./models/user');

const auth = async(req, res, next) => {
    try {
        console.log("auth bhai");
        const token = req.cookies.jwt;
        console.log(token);
        if (token == undefined) {
            return res.send({ status: 'error', message: 'Unauthroized user' });
        }
        const verifyUser = jwt.verify(token, process.env.SECRETE_KEY);
        console.log(verifyUser);
        const userr = await user.findOne({ userName: verifyUser.userName });
        console.log(user.userName);
        req.token = token;
        req.userr = userr;
        next();
    } catch (error) {
        return error;
    }
}

module.exports = auth;
