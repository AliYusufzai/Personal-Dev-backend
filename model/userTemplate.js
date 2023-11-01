const mongoose = require("mongoose");

const userTemplateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    templateFilePath: [{ type: String }],
});

module.exports = mongoose.model("UserTemplate", userTemplateSchema);
