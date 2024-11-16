// server.js

require("dotenv").config();
require("./passport")
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require('body-parser');
const authRoute = require("./routes/auth");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const segment = require("./routes/segments");
const campaign = require("./routes/sendCampaign");
const communicationLogs = require("./routes/getCommunicationLog");
const deliveryReciept = require("./routes/deliveryReciept");
const { connectProducer, connectConsumer } = require('./kafkaConfig');
const connectToMongo = require('./db');

const app = express();

connectToMongo();

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/api", customerRoutes);
app.use("/api", orderRoutes);
app.use("/api", segment);
app.use("/api", campaign);
app.use("/api", communicationLogs);
app.use("/api", deliveryReciept);

const port = process.env.PORT || 8080;
const startServer = async () => {
    await connectProducer();
    await connectConsumer(); // Connect Kafka Consumer
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();
