const path = require('path');
const fs = require('fs');
const https = require('https');
const {
    uploadFile,
    multerMultipaleFile,
    multerSingleFile,
    fileURL
} = require("./utils/firebase-helper");
const {
    isUuid
} = require('uuidv4');

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash');
const {
    ExpressPeerServer
} = require('peer');


const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.cieakpt.mongodb.net/${process.env.MONGODB_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();
var server = require('http').createServer(app);

const store = MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require("./routes/admin");
const conversationRoute = require("./routes/conversations");
const authRoute = require("./routes/auth");
const buyRoute = require("./routes/buy");
const indexRoute = require("./routes/index");
const rentRoute = require("./routes/rent");
const propertyRoute = require("./routes/property");

const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({
    extended: false
}));
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: (28 * 24 * 60 * 60 * 1000)
    }
}));

app.use(flash());

app.use(require("./middleware/set-locals").setLocals);

app.use(authRoute);

app.use(indexRoute);

app.use("/admin", adminRoute);

app.use("/conversations", conversationRoute);

app.use("/buy", buyRoute);

app.use("/rent", rentRoute);

app.use("/property", propertyRoute)

app.use(errorController.error404)

app.use((error, req, res, next) => {
    console.log(error);
    res.render("error/error", {
        pageTitle: error.statusCode + ":ERROR",
        path: "",
        errorCode: error.statusCode,
        errorLable: error.message,
        errorDiscription: error.discription
    })
})

const port = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI)
    .then(result => {
            server.listen(port, () => {
                console.log("server started")
            });

            const io = require('./socket').init(server)
            io.on('connection', socket => {
                    console.log('Client connected');
                    socket.on('join', function (data) {
                        socket.join(data.id);
                    });
                    socket.on('join-room', (roomId, userId) => {
                            console.log(roomId, userId);
                            console.log(isUuid(roomId))
                            if (isUuid(roomId)) {
                                socket.join(roomId);
                                socket.to(roomId).emit('user-connected', userId);
                            }
                            socket.on('disconnect', () => {
                                console.log("disconnected:");
                                socket.to(roomId).emit('user-disconnected', userId)
                            });
                            socket.on('update', () => {
                                socket.to(roomId).emit('user-updated', userId)
                            })
                    });

                socket.on('disconnect', () => {
                    console.log("disconnected:");
                });
            });
    })
.catch(err => {
    console.log(err);
})