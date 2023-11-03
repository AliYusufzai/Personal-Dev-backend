const UserDetails = require("../../model/userDetails");
const Users = require("../../model/user");
const CareerInfo = require("../../model/careerInfo");
const PersonalInfo = require("../../model/personalInfo");
const Template = require("../../model/template");
const { exec } = require("child_process");
const fsPromises = require("fs/promises");
const fileCreation = require("../../middleware/fileConfig");

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
            
            const { html, css } = data;
            const parsedHtml = JSON.parse(html);
            const parsedCss = JSON.parse(css);
            const fileName = data.templateName;

            const filePath = await fileCreation(parsedHtml, parsedCss, fileName);
            const fileContent = await fsPromises.readFile(filePath, "utf-8");

            res.status(201).json({ success: 1, fileContent });
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
};
