const UserDetails = require("../../model/userDetails");
const Users = require("../../model/user");
const CareerInfo = require("../../model/careerInfo");
const PersonalInfo = require("../../model/personalInfo");
const Template = require("../../model/template");
const cloudinary = require("../../middleware/cloudinaryConfig");
const UserTemplate = require("../../model/userTemplate");
const cheerio = require("cheerio");
const { exec } = require("child_process");

//const { exec } = require("child_process");
//const fsPromises = require("fs/promises");
//const fileCreation = require("../../middleware/fileConfig");

module.exports = {
    show: async (req, res) => {
        try {
            const { userId } = req.params;
            let userDetails;

            const user = await Users.findOne({ where: { id: userId } });
            if (user) {
                userDetails = await UserDetails.findOne({
                    where: { userId: user.id },
                    include: [CareerInfo, PersonalInfo],
                });
            } else {
                return res
                    .status(404)
                    .json({ success: 0, message: "User not found" });
            }

            const favourite = JSON.parse(userDetails.favourite);
            if (favourite.length === 0) {
                return res.status(404).json({
                    success: 0,
                    message: "No Favourite template found",
                });
            }
            const keys = Object.keys(favourite);
            const mostRecent = keys[keys.length - 1];

            const templateData = await Template.findOne({
                where: { id: mostRecent },
            });
            if (!templateData) {
                return res.status(404).json({
                    message: "Template not found for the most recent file",
                });
            }

            return res.status(200).json({
                success: 1,
                user: user,
                userDetails: userDetails,
                data: templateData,
            });
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { user, userDetails, data } = req.body;
            let userTemplateEntry;

            const { html, css } = data;
            let parsedHtml = JSON.parse(html);
            let parsedCss = JSON.parse(css);
            const fileName = data.templateName;

            // const filePath = await fileCreation(
            //     parsedHtml,
            //     parsedCss,
            //     fileName
            // );
            // let fileContent = await fsPromises.readFile(filePath, "utf-8");

            const unnestedUserData = {
                ...user,
                ...userDetails,
                ...userDetails.Career_Info,
                ...userDetails.Personal_Info,
            };
            for (const key in unnestedUserData) {
                if (unnestedUserData.hasOwnProperty(key)) {
                    const placeholder = `{{${key}}}`;
                    const replacement = unnestedUserData[key];
                    parsedHtml = parsedHtml.replace(
                        new RegExp(placeholder, "g"),
                        replacement
                    );
                }
            }
            // await fsPromises.writeFile(filePath, fileContent, "utf-8");
            //console.log("updated content: ", parsedHtml);

            const userTemplate = await UserTemplate.findOne({
                where: { templateId: data.id },
            });
            if (userTemplate) {
                userTemplateEntry = await userTemplate.update({
                    userId: user.id,
                    templateName: fileName,
                    html: parsedHtml,
                    css: parsedCss,
                    image: data.image,
                });
            } else {
                userTemplateEntry = new UserTemplate({
                    userId: user.id,
                    templateId: data.id,
                    templateName: fileName,
                    html: parsedHtml,
                    css: parsedCss,
                    image: data.image,
                });
                await userTemplateEntry.save();
            }

            return res.status(201).send({
                success: 1,
                message: "User Template has been successfully uploaded",
            });
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
    open: async (req, res) => {
        const { templateId } = req.params;
        try {
            const userTemplate = await UserTemplate.findOne({
                where: { templateId },
            });
            if (!userTemplate) {
                return res
                    .status(404)
                    .json({ message: "User-specific Template not found" });
            }

            const { dataValues } = userTemplate;
            let { html, css } = dataValues;
            html = JSON.parse(html);
            css = JSON.parse(css);

            const $ = cheerio.load(html);
            $("head").append(`<style>${css}</style>`);
            const combinedContent = $.html();

            exec(
                `start "" "chrome.exe" --new-window "data:text/html,${encodeURIComponent(
                    combinedContent
                )}"`
            );
            return res.status(200).json({
                message: "File opened in a new tab",
                template: combinedContent,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "An error occurred" });
        }
    },
    display: async (req, res) => {
        const { userId } = req.params;
        try {
            const userTemplate = await UserTemplate.findAll({
                where: { userId },
            });
            if (!userTemplate) {
                return res
                    .status(404)
                    .json({ message: "User-specific Template not found" });
            }

            let { templateId, html, css } =
                userTemplate[userTemplate.length - 1];
            html = JSON.parse(html);
            css = JSON.parse(css);

            const $ = cheerio.load(html);
            $("head").append(`<style>${css}</style>`);
            const combinedContent = $.html();

            res.set("Content-Type", "text/html");
            res.status(200).send({
                userTemplate: templateId,
                template: combinedContent,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "An error occurred" });
        }
    },
    updateCss: async (req, res) => {
        try {
            const { user, templateId, cssData } = req.body;

            let userTemplateEntry;
            const template = await UserTemplate.findOne({
                where: { templateId },
            });
            if (!template) {
                return res
                    .status(404)
                    .json({ message: "User-specific Template not found" });
            }

            const { css } = template;
            let parsedCss = JSON.parse(css);

            for (const key in cssData) {
                if (cssData.hasOwnProperty(key)) {
                    const placeholder = `--${key}`;
                    const value = cssData[key];
                    const pattern = new RegExp(
                        `(${placeholder}:\\s*)[^;]+;`,
                        "g"
                    );

                    parsedCss = parsedCss.replace(pattern, `$1${value};`);
                }
            }

            userTemplateEntry = await UserTemplate.update(
                {
                    css: parsedCss,
                },
                { where: { templateId } }
            );

            return res.status(201).send({
                success: 1,
                message: "User Template has been successfully uploaded",
            });
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
};
