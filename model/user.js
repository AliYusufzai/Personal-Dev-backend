const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const userSchema = sequelize.define("Users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: { type: Sequelize.STRING, allowNull: true },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
    },
    isdeleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
});

module.exports = userSchema;
