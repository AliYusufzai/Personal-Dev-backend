const sequelize = require("../config/database");
const Sequelize = require("sequelize");
const Users = require("./user");
const Templates = require("./template");

const userTemplateSchema = sequelize.define("User_Template", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: "Users",
            key: "id",
        },
    },
    templateId: {
        type: Sequelize.INTEGER,
        references: {
            model: "Templates",
            key: "id",
        },
    },
    templateName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    html: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    css: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isdeleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
});

module.exports = userTemplateSchema;
