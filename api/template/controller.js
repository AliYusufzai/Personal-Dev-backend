const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const cloudinary = require("../../middleware/cloudinaryConfig");
const Template = require("../../model/template");

module.exports = {
    create: async (req, res) => {
        try {
            let imgResults;

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "No file uploaded." });
            }
            for (const file of req.files) {
                if (file.mimetype.startsWith("image")) {
                    const imgResult = await cloudinary.uploader.upload(
                        file.path
                    );
                    imgResults = imgResult.secure_url;
                }
            }

            const content = await fs.promises.readFile(
                req.files[0].path,
                "utf-8"
            );
            const $ = cheerio.load(content);
            const cssPart = $("style").text();
            $("style").remove();
            const htmlPart = $("html").html();

            const templateEntry = new Template({
                templateName: req.files[0].filename,
                html: htmlPart,
                css: cssPart,
                image: imgResults,
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
    index: async (req, res) => {
        try {
            const getTemplate = await Template.findAll({
                where: { isdeleted: 0 },
            });
            const formattedTemplate = getTemplate.map((template) => ({
                id: template.id,
                html: template.html.replace(/\\n/g, "/n/"),
                css: template.css.replace(/\\n/g, "/n/"),
                image: template.image,
            }));

            res.status(200).json({ success: 1, data: formattedTemplate });
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
    show: async (req, res) => {
        try {
            const templateId = req.params.id;
            const getTemplate = await Template.findOne({
                where: { id: templateId, isdeleted: 0 },
            });
            if (getTemplate) {
                const formattedTemplate = {
                    id: getTemplate.id,
                    html: getTemplate.html.replace(/\\n/g, "/n/"),
                    css: getTemplate.css.replace(/\\n/g, "/n/"),
                    image: getTemplate.image,
                };
                return res
                    .status(200)
                    .json({ success: 1, data: formattedTemplate });
            } else {
                return res
                    .status(404)
                    .json({ success: 0, error: "Template not found" });
            }
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
    destroy: async (req, res) => {
        try {
            const templateId = req.params.id;
            const deleteTemplate = await Template.update(
                { isdeleted: 1 },
                {
                    where: { id: templateId },
                }
            );

            return res
                .status(200)
                .json({ success: 1, message: "Template has been deleted" });
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
};
