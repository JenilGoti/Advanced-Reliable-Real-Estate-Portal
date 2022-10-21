const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoute = require("./routes/admin");
const agentRoute = require("./routes/agent");
const authRoute = require("./routes/auth");
const buyRoute = require("./routes/buy");
const indexRoute = require("./routes/index");
const rentRoute = require("./routes/rent");
const sellRoute = require("./routes/sell");

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(authRoute);
app.use(indexRoute);
app.use("/admin", adminRoute);
app.use("/agent", agentRoute);
app.use("/buy", buyRoute);
app.use("/rent", rentRoute);
app.use("/sell", sellRoute);










const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log("server started succesfully on " + port);
});