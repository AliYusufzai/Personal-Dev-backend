const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const Template = require("../../model/template");

module.exports = {
    fileUpload: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded." });
            }
            const content = await fs.promises.readFile(req.file.path, "utf-8");

            const $ = cheerio.load(content);
            const cssPart = $("style").text();
            $("style").remove();
            const htmlPart = $("html").html();

            const templateEntry = new Template({
                templateName: req.file.filename,
                html: htmlPart,
                css: cssPart,
            });
            await templateEntry.save();
            return res
                .status(201)
                .send({ message: "File has been successfully uploaded" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: error.message });
        }
    },
};
