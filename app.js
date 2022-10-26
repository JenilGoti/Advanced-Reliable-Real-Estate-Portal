const path = require('path');
const fs = require('fs');
const https = require('https');
const {
    uploadFile,
    multerMultipaleFile,
    multerSingleFile,
    fileURL
} = require("./utils/firebase-helper");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.cieakpt.mongodb.net/${process.env.MONGODB_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
console.log(process.env.MONGODB_USER);


const app = express();

const store = MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require("./routes/admin");
const agentRoute = require("./routes/agent");
const authRoute = require("./routes/auth");
const buyRoute = require("./routes/buy");
const indexRoute = require("./routes/index");
const rentRoute = require("./routes/rent");
const sellRoute = require("./routes/sell");

const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({
    extended: false
}));


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

app.use("/agent", agentRoute);

app.use("/buy", buyRoute);

app.use("/rent", rentRoute);

app.use("/sell", sellRoute);

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
        app.listen(port, () => {
            console.log("server started succesfully on " + port);
        });
    })
    .catch(err => {
        console.log(err);
    })