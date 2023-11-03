const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const userSchema = sequelize.define("Users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: { type: Sequelize.STRING, allowNull: false },
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

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     phonenumber: {
//         type: String,
//         required: true,
//     },
//     checkbox: {
//         type: Number,
//         enum: [0, 1],
//     },
//     favourite: { type: [String], default: [] },
//     color: {
//         type: String,
//         validate: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
//     },
//     font: { type: String },
//     checkboxTwo: {
//         type: Number,
//         enum: [0, 1],
//     },
//     background: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Background",
//     },
//     backgroundTwo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "BackgroundTwo",
//     },
// });
