require("dotenv").config();
const express = require("express");
const app = express();
// const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const formOneRoute = require("./routes/formOneRoute");
// const templateRoute = require("./routes/templateRoute");
const templateChangeRoute = require("./routes/templateChangesRoute");
const templateRoute = require("./api/template/router");
const qs = require("qs");

// const MONGO_URL = "";

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Database");
    } catch (error) {
        console.error("Error connecting to the database", error.message);
    }
};

connection();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.query = qs.parse(req.query);
    next();
});

app.use("/getstarted", formOneRoute);
// app.use("/upload", templateRoute);
app.use("/change", templateChangeRoute);
app.use("/upload", templateRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
