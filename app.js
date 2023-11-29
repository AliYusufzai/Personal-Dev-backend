require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const sequelize = require("./config/database");
const userDetails = require("./model/userDetails");
const templateRoute = require("./api/template/router");
const formInputRoute = require("./api/form_inputs/router");
const userTemplateRoute = require("./api/user_template/router");
const userRoute = require("./api/user/router");

app.use("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/template", templateRoute);
app.use("/form", formInputRoute);
app.use("/template-change", userTemplateRoute);
app.use("/user", userRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
