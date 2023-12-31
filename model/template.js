const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const templateSchema = sequelize.define("Templates", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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


module.exports = templateSchema;
