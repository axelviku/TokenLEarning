const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const sessions = require('express-session');
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser');
require('./db');
require('dotenv').config()
    // require('./auth');

const WebSocket = require('ws')
const port = process.env.PORT || 3000;
const app = express();
// const server = require('http').createServer(app);
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyparser.json());


app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    // cookie: { maxAge: oneDay },
    resave: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/iBeacon' }),
    duration: 3 * 60 * 60 * 1000, // how long the session will stay valid in ms
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        ephemeral: true, //cookie expires when the browser closes
        maxAge: 3 * 60 * 60 * 1000 //set the max age in case ephemeral not used
    },
}));


// app.use(function(req, res, next) {
//     req.testing = 'Hello Vikrant';
//     return next();
// });

// app.get('/', function(req, res, next) {

//     console.log('get route', req.testing);
//     // ws(JSON.stringify(req.testing));
//     res.end(JSON.stringify(req.testing));
// });

// app.ws('/', function(ws, req) {
//     ws.on('message', function(msg) {
//         console.log(msg);
//     });
//     console.log('socket', req.testing);

// });
// var path = require('path');
// var ws = require('express-ws')(app);
// app.get('/', (req, res) => {
//     console.error('express connection');
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
// app.ws('/', (s, req) => {
//     console.error('websocket connection');
//     for (var t = 0; t < 3; t++)
//         setTimeout(() => s.send('message from server', () => {}), 1000 * t);
// });

// app.listen(port, () => {
//     console.log(`Server is listening on ${port}`);
// })



// const wss = new WebSocket.Server({ server: server });
// wss.on('connection', function connection(ws) {
//     console.log('A new client Connected!');
//     ws.send('Welcome New Client!');

//     ws.on('message', function incoming(message) {
//         console.log('received: %s', message);

//         wss.clients.forEach(function each(client) {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(message);
//             }
//         });
//     });
// });
// server.listen(port, () => {
//     console.log(`Listening on port ${port}`)
// })

app.get('/', function(req, res) {
    res.send('Hello World!')
})
var expressWs = require('express-ws')(app);

expressWs.app.ws('/calculate', function(ws, req) { // Get Messages From ws
    console.log("from wxpressWs");
    ws.on('message', function(msg) {
        console.log("From Other the Sider", msg);
    })
});
const aWss = expressWs.getWss('/calculate');
// console.log('aWss', aWss);
module.exports.sendWebSocket = function sendWebSocket(data) {
    console.log("sendWebSocket", data);
    aWss.clients.forEach(function(client) {
        client.send(data);
    })
}

const router = require('./router');
app.use(router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})