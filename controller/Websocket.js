const express = require('express');
const stompit = require('stompit');
const router = new express.Router();
const sendwebSocketMessage = require('../server');
const iBeacon = require('../models/info');
const cardData = require('../models/cardInfo');
const MetaData = require('../models/meta-data');
const user = require('../models/user');
const metaData = require('../models/meta-data');

// module.exports.WebSocketsApi = function(req, res) {
//     console.log(req.body);
//     setTimeout(function() {
//         const xy = [-10, -20, -30, -40, -50, -60, -70, -80, -90, -100, -110, -120, -130, -140];
//         // console.log(xy.length);
//         for (var i = 0; i < xy.length; i++) {
//             console.log(xy.length);
//             const measuredPower = -69;
//             const RSSI = req.body.RSSII;
//             console.log("xy[i]", xy[i]);
//             const calc = (measuredPower - (xy[i])) / 20;
//             const FinalCalc = Math.pow(10, calc);
//             const inKM = (FinalCalc / 1000);
//             console.log(FinalCalc, "------------", inKM + " KM");
//             // res.send({ message: "Data is:- " + Roundd + "KM" });
//             const bearing = 360;
//             const bearing_rad = (bearing * Math.PI) / 180;
//             console.log("bearing_rad", bearing_rad);
//             const distance = inKM;
//             console.log("distancce", distance);

//             const EARTH_RADIUS = 6378.1;

//             const initial_position = {
//                 "latitude": 26.8961,
//                 "longitude": 75.7557
//             };
//             const init_lat = (initial_position.latitude * Math.PI) / 180;
//             const init_lon = (initial_position.longitude * Math.PI) / 180;
//             console.log("Start", init_lat, init_lon);
//             const final_lat = (180 / Math.PI) * (Math.asin(Math.sin(init_lat) * Math.cos(distance / EARTH_RADIUS) + Math.cos(init_lat) * Math.sin(distance / EARTH_RADIUS) * Math.cos(bearing_rad)));

//             const final_lon = (180 / Math.PI) * (init_lon + Math.atan2(Math.sin(bearing_rad) * Math.sin(distance / EARTH_RADIUS) * Math.cos(init_lat), Math.cos(distance / EARTH_RADIUS) - Math.sin(init_lat) * Math.sin(final_lat)));

//             console.log("after calculation", final_lat, final_lon);
//             sendWebSocketData = {};
//             sendWebSocketData['lat'] = final_lat;
//             sendWebSocketData['lng'] = final_lon;
//             sendWebSocketData['deviceName'] = 'AC233FC045D6';
//             sendwebSocketMessage.sendWebSocket(JSON.stringify(sendWebSocketData));
//             // realTimeData1(JSON.stringify(sendWebSocketData));
//             console.log("sendWebSocketData", sendWebSocketData);
//         }
//     }, 3000);

//     res.send({});
// }


module.exports.WebSocketsApi2 = async function(req, res) {
    console.log(req.body);
    let DetailsInfoCard = [];
    const v = await cardData.find({ name: req.body.name }).sort({ _id: -1 });
    console.log("v", v.length);
    for (let i = 0; i < v.length; i++) {
        DetailsInfoCard[i] = {
            mac: v[i].mac,
            lat: v[i].lat,
            lng: v[i].lng,
            latitude: v[i].latitude,
            longitude: v[i].longitude,
            metaData: v[i].metaData.createdAt
        }
    }
    console.log("vikrant", DetailsInfoCard);
    // setTimeout(function() {
    for (var i = 0; i < DetailsInfoCard.length; i++) {
        // const initial_position = {
        //     "latitude": 26.8961,
        //     "longitude": 75.7557
        // };

        sendWebSocketData = [];
        sendWebSocketData = {
            gatewayLat: DetailsInfoCard[i].latitude,
            gatewayLng: DetailsInfoCard[i].longitude,
            deviceName: v[i].gatewayMac,
            Card: {
                cardName: v[i].mac,
                lat: DetailsInfoCard[i].lat,
                lng: DetailsInfoCard[i].lng,
                time: DetailsInfoCard[i].metaData
            }
        }
        sendwebSocketMessage.sendWebSocket(JSON.stringify(sendWebSocketData));
        // realTimeData1(JSON.stringify(sendWebSocketData));
        console.log("sendWebSocketData", sendWebSocketData);

        // }, 3000);

    }
    res.send({});
}

//saving data from BLE router
module.exports.BLE = async function(req, res) {
    try {
        console.log(req.body);
        const returnData = {
            name: req.body.name,
            time: new Date(),
            battery: req.body.battery,
            gatewayMac: req.body.gatewayMac,
            mac: req.body.mac,
            rssi: req.body.rssi
        }
        const saveValue = await iBeacon.create(returnData);
        return res.send({ message: 'Data Successfully Save', data: saveValue })
    } catch (error) {
        return res.send({ status: 'error', message: error });
    }
}

//saving one time data in a day cardData DB
module.exports.WebSocketsApi3 = async function(req, res) {
    console.log(req.body);
    let DetailsInfoCard = [];
    const v = await iBeacon.find({ gatewayMac: req.body.gatewayMac, mac: req.body.mac }).sort({ _id: -1 }).limit(1);
    console.log("v", v.length);
    for (let i = 0; i < v.length; i++) {
        DetailsInfoCard[i] = {
            rssi: v[i].rssi,
        }
    }
    // setTimeout(function() {
    for (var i = 0; i < DetailsInfoCard.length; i++) {
        const measuredPower = -69;
        const calc = (measuredPower - (DetailsInfoCard[i].rssi)) / 20;
        console.log("-------------------->", calc);
        const FinalCalc = Math.pow(10, calc);
        const inKM = (FinalCalc / 1000);
        console.log(FinalCalc, "------------", inKM + " KM");
        const bearing = 360;
        const bearing_rad = (bearing * Math.PI) / 180;
        console.log("bearing_rad", bearing_rad);
        const distance = inKM;
        console.log("distancce", distance);

        const EARTH_RADIUS = 6378.1;

        const initial_position = {
            "latitude": 26.8961,
            "longitude": 75.7557
        };
        const init_lat = (initial_position.latitude * Math.PI) / 180;
        const init_lon = (initial_position.longitude * Math.PI) / 180;
        console.log("Start", init_lat, init_lon);
        const final_lat = (180 / Math.PI) * (Math.asin(Math.sin(init_lat) * Math.cos(distance / EARTH_RADIUS) + Math.cos(init_lat) * Math.sin(distance / EARTH_RADIUS) * Math.cos(bearing_rad)));

        const final_lon = (180 / Math.PI) * (init_lon + Math.atan2(Math.sin(bearing_rad) * Math.sin(distance / EARTH_RADIUS) * Math.cos(init_lat), Math.cos(distance / EARTH_RADIUS) - Math.sin(init_lat) * Math.sin(final_lat)));

        console.log("after calculation", final_lat, final_lon);
        sendWebSocketData = [];
        sendWebSocketData = {
            gatewayLat: initial_position.latitude,
            gatewayLng: initial_position.longitude,
            deviceName: v[i].gatewayMac,
            Card: {
                cardName: v[i].mac,
                lat: final_lat,
                lng: final_lon,
            }
        }
        sendwebSocketMessage.sendWebSocket(JSON.stringify(sendWebSocketData));
        // sendWebSocketData.push(sendWebSocketData1)
        const ji = await cardData.findOne({ 'mac': req.body.mac }).sort({ _id: -1 }).lean();
        if (ji === null) {
            const returnData = {
                gatewayMac: req.body.gatewayMac,
                mac: req.body.mac,
                lat: final_lat,
                lng: final_lon,
                'metaData.createdAt': MetaData.dateInfo(),
                name: 'BLE',
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
            cardData.create(returnData);
        } else if (req.body.mac === ji.mac) {
            console.log("hiiii", req.body.mac === ji.mac);
            var todayDate = new Date().toISOString().slice(0, 10);
            console.log("date", new Date(ji.metaData.createdAt).toISOString().slice(0, 10), todayDate);
            console.log(new Date(ji.metaData.createdAt).toISOString().slice(0, 10) == todayDate);
            if (new Date(ji.metaData.createdAt).toISOString().slice(0, 10) == todayDate) {
                return res.send({ status: 'success', message: 'Today Data already inserted' });
            } else {
                const returnData = {
                    gatewayMac: req.body.gatewayMac,
                    mac: req.body.mac,
                    lat: final_lat,
                    lng: final_lon,
                    name: 'BLE',
                    'metaData.createdAt': MetaData.dateInfo(),
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                }
                cardData.create(returnData);
            }
        }
        // realTimeData1(JSON.stringify(sendWebSocketData));
        console.log("sendWebSocketData", sendWebSocketData);
    }
    // }, 3000);
    res.send({});
}

// async function realTimeData1(data, res) {
//     const connectOptions = {
//         'host': 'localhost',
//         'port': 61613,
//         'connectHeaders': {
//             'host': '/',
//             'login': 'username',
//             'passcode': 'password',
//             // 'heart-beat': '3000,3000'
//         }
//     };

//     stompit.connect(connectOptions, function(error, client) {

//         if (error) {
//             console.log('connect error ' + error.message);
//             return;
//         }

//         const sendHeaders = {
//             'destination': 'test1',
//             'content-type': 'text/plain'
//         };


//         const frame = client.send(sendHeaders);
//         console.log("pro", data);
//         frame.write(data);
//         console.log("data", data);
//         frame.end();

//         const subscribeHeaders = {
//             'destination': 'test1',
//     'ack': 'client-individual'
// };

// client.subscribe(subscribeHeaders, function(error, message) {

//     if (error) {
//         console.log('subscribe error ' + error.message);
//         return;
//     }

//     message.readString('utf-8', function(error, body) {

//         if (error) {
//             console.log('read message error ' + error.message);
//             return;
//         }

//         console.log('received message: ' + body);

//         client.ack(message);

//         client.disconnect();
//     });
// });
//     });
// }

module.exports.gatewayData = async function(req, res) {
    try {
        console.log(req.body);
        let DetailsInfoCard = [];
        const v = await cardData.find({ name: req.body.name }).sort({ _id: -1 });
        console.log("v", v.length);
        for (let i = 0; i < v.length; i++) {
            DetailsInfoCard[i] = {
                mac: v[i].mac,
                lat: v[i].lat,
                lng: v[i].lng,
                latitude: v[i].latitude,
                longitude: v[i].longitude
            }
        }
        for (var i = 0; i < DetailsInfoCard.length; i++) {
            // const initial_position = {
            //     "latitude": 26.8961,
            //     "longitude": 75.7557
            // };

            sendWebSocketData = [];
            sendWebSocketData = {
                gatewayLat: DetailsInfoCard[i].latitude,
                gatewayLng: DetailsInfoCard[i].longitude,
                deviceName: v[i].gatewayMac,
                Card: {
                    cardName: v[i].mac,
                    lat: DetailsInfoCard[i].lat,
                    lng: DetailsInfoCard[i].lng,
                }
            }
            sendwebSocketMessage.sendWebSocket(JSON.stringify(sendWebSocketData));
            // realTimeData1(JSON.stringify(sendWebSocketData));
            console.log("sendWebSocketData", sendWebSocketData);

            // }, 3000);

        }
        res.send({});
    } catch (error) {

    }
}

module.exports.celebration = async function(req, res) {
    try {
        var DetailsInfo = [];
        console.log(req.body);
        var todayDate = new Date().toISOString().slice(0, 10);
        console.log("date", new Date(ji.metaData.createdAt).toISOString().slice(0, 10), todayDate);
        var returnData = await user.find({ companyID: req.params.companyID });
        // var matchDate = new Date(ji.metaData.createdAt).toISOString().slice(0, 10)
        console.log(new Date(returnData.metaData.createdAt).toISOString().slice(0, 10) == todayDate);
        if (new Date(returnData.metaData.createdAt).toISOString().slice(0, 10) == todayDate) {
            for (let i = 0; i < returnData.length; i++) {
                DetailsInfo[i] = {
                    name: returnData[i].Name,
                    firstName: returnData[i].profile.contactInfo.firstName,
                    phone: returnData[i].profile.contactInfo.phone,
                    countryCode: returnData[i].profile.contactInfo.address.country_code
                }
            }
        }
        res.send({ status: 'success', message: 'Data successfully find', data: DetailsInfo })
    } catch (error) {

    }
}