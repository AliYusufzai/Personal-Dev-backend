const sequelize = require("../config/database");
const Sequelize = require("sequelize");
const Users = require("./user");
const CareerInfo = require("./careerInfo");
const PersonalInfo = require("./personalInfo");

const userDetailsSchema = sequelize.define("User_Details", {
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
    businessType: {
        type: Sequelize.INTEGER,
        validate: {
            isIn: {
                args: [[0, 1]],
                msg: "Business Type must be 0 or 1",
            },
        },
    },
    favourite: {
        type: Sequelize.JSON,
    },
    color: {
        type: Sequelize.STRING,
        validate: {
            is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        },
    },
    font: {
        type: Sequelize.STRING,
    },
    careerType: {
        type: Sequelize.INTEGER,
        validate: {
            isIn: {
                args: [[0, 1]],
                msg: "Career Type must be 0 or 1",
            },
        },
    },
    careerInfo: {
        type: Sequelize.INTEGER,
        references: {
            model: "CareerInfo",
            key: "id",
        },
    },
    personalInfo: {
        type: Sequelize.INTEGER,
        references: {
            model: "PersonalInfo",
            key: "id",
        },
    },
});

userDetailsSchema.belongsTo(Users, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});
userDetailsSchema.belongsTo(CareerInfo, {
    foreignKey: "careerInfo",
    onDelete: "CASCADE",
});
userDetailsSchema.belongsTo(PersonalInfo, {
    foreignKey: "personalInfo",
    onDelete: "CASCADE",
});

module.exports = userDetailsSchema;
