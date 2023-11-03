const sequelize = require("../config/database");
const Sequelize = require("sequelize");

const careerInfoSchema = sequelize.define("Career_Info", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    industry: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    skills: {
        type: Sequelize.JSON,
    },
    experience: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tools: {
        type: Sequelize.JSON,
    },
});

module.exports = careerInfoSchema;
