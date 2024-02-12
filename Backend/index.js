const express = require('express');
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authroutes');
const fileRoutes = require('./routes/fileshareroutes');
require('./db');
require('./Models/userModels');
require('./Models/verificationModel');
const app = express();
const server = http.createServer(app);
const io = socketIo(server)
const allowOrigins = ['*'];
app.use(bodyParser.json({ limit: '5mb' }));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true

    })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));



// Sharing the instance with fileshareRoutes
app.use((req, res, next) => {
    req.io = io;
    next();
})
app.use('/auth', authRoutes);
app.use('/file', fileRoutes);

app.get('/', (req, res) => {
    res.send('Api is running...');
});

server.listen(5000, () => {
    console.log('Server is running')
});
