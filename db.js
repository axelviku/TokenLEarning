const mongoose = require('mongoose');
try {
    mongoose.connect("mongodb://localhost:27017/iBeacon", { useNewUrlParser: true })
    console.log("Database Connected Successfully.....");
    // console.log(mongoose.connection);
    // mongoose.createConnection("mongodb://localhost:27017/vikuPayroll1",{ useNewUrlParser:true})
} catch (error) {
    console.log("Connection error");
}