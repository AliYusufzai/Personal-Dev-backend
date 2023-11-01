const mongoose = require("mongoose");

const backgroundSchema = new mongoose.Schema({
    industry: {
        type: String,
        required: true,
    },
    skills: [String],
    experience: {
        type: String,
        required: true,
    },
    tools: [String],
});

module.exports = mongoose.model("Background", backgroundSchema);
