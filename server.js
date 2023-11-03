require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const formOneRoute = require("./routes/formOneRoute");
// const templateRoute = require("./routes/templateRoute");
const templateChangeRoute = require("./routes/templateChangesRoute");
const templateRoute = require("./api/template/router");
const formInputRoute = require("./api/form_inputs/router");
const userTemplateRoute = require("./api/user_template/router");
const qs = require("qs");
const sequelize = require("./config/database");
const userDetails = require("./model/userDetails");

sequelize
    .authenticate()
    .then(() => {
        console.log(
            "Connection to the database has been established successfully."
        );
        sequelize
            .sync()
            .then(() => {
                console.log("Database and tables have been created!");
            })
            .catch((syncError) => {
                console.error("Error synchronizing models:", syncError);
            });
    })
    .catch((authError) => {
        console.error("Unable to connect to the database: ", authError);
    });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.query = qs.parse(req.query);
    next();
});

app.use("/getstarted", formOneRoute);
// app.use("/upload", templateRoute);
// app.use("/change", templateChangeRoute);
app.use("/template", templateRoute);
app.use("/form", formInputRoute);
app.use("/template-change", userTemplateRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
