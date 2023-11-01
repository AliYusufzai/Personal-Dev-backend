const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
    {
        templateName: { type: String },
        html: { type: Buffer },
        css: { type: Buffer },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);