const mongoose = require('mongoose');
const MetaData = require('./meta-data');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


const userSchema = new mongoose.Schema({

    userName: {
        require: true,
        type: String
    },
    email: {
        require: true,
        type: String
    },
    metaData: MetaData.schema,
    mobile: {
        require: true,
        type: Number
    },
    password: {
        require: true,
        type: String
    },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
});


userSchema.methods.generateAuthToken = async function(res, req) {
    try {
        const token = jwt.sign({ userName: this.userName.toString() }, process.env.SECRETE_KEY);
        // this.tokens = this.tokens.concat({ token: token });
        // await this.save();
        return token;
    } catch (error) {
        res.send({ message: error.message });
    }
}
module.exports = new mongoose.model('user', userSchema);