require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: () => {},
    }
);

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

module.exports = sequelize;
