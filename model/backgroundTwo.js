const mongoose = require("mongoose");

const backgroundTwoSchema = new mongoose.Schema(
    {
        language: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BackgroundTwo", backgroundTwoSchema);
