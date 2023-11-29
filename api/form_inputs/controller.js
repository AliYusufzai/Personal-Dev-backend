const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const cloudinary = require("../../middleware/cloudinaryConfig");
const User = require("../../model/user");
const UserDetails = require("../../model/userDetails");
const CareerInfo = require("../../model/careerInfo");
const PersonalInfo = require("../../model/personalInfo");

module.exports = {
    formOne: async (req, res) => {
        try {
            let formEntry;
            const { name, email, phone, password } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                existingUser.username = name;
                existingUser.phone = phone;
                existingUser.email = email;
                existingUser.password = password;
                await existingUser.save();
                formEntry = existingUser;
            } else {
                formEntry = await User.create({
                    username: name,
                    email,
                    phone,
                    password,
                });
                await formEntry.save();
            }

            res.status(201).json({
                success: 1,
                user: formEntry,
            });
        } catch (error) {
            res.status(500).json({ success: 0, message: error.message });
        }
    },
    formTwo: async (req, res) => {
        const { userId, businessType } = req.body;
        try {
            let formEntry = await UserDetails.findOne({
                where: { userId: userId },
            });

            if (formEntry) {
                formEntry.businessType = businessType;
                await formEntry.save();
            } else {
                formEntry = await UserDetails.create({ userId, businessType });
            }
            res.status(200).json({
                success: 1,
                message: "User details confirmed",
            });
        } catch (error) {
            res.status(500).json({
                success: 0,
                error: error.message,
            });
        }
    },
    formThree: async (req, res) => {
        try {
            const { userId, fileId } = req.body;
            const user = await UserDetails.findOne({
                where: { userId: userId },
            });
            if (user) {
                if (user) {
                    const currentFavorites = JSON.parse(user.favourite || "{}");
                    const fileIdStr = fileId.toString();
                    if (!currentFavorites[fileIdStr]) {
                        currentFavorites[fileIdStr] = true;
                        await user.update({ favourite: currentFavorites });
                        res.status(201).json({
                            success: 1,
                            message: "Template added to favorites",
                        });
                    } else {
                        res.status(200).json({
                            success: 1,
                            message: "Template is already in favorites",
                        });
                    }
                }
            } else {
                res.status(404).json({ success: 0, message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
    formFour: async (req, res) => {
        const { userId, colorValue } = req.body;
        try {
            const user = await UserDetails.findOne({
                where: { userId: userId },
            });
            if (user) {
                await user.update({ color: colorValue });
                res.status(201).json({
                    success: 1,
                    message: "Color has been updated",
                });
            } else {
                res.status(404).json({ success: 0, message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
    formFive: async (req, res) => {
        try {
            const { userId, fontName } = req.body;
            const user = await UserDetails.findOne({
                where: { userId: userId },
            });
            if (user) {
                await user.update({ font: fontName });
                res.status(201).json({
                    success: 1,
                    message: "Font has been updated",
                });
            } else {
                res.status(404).json({ success: 0, message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    formSix: async (req, res) => {
        try {
            const { userId, careerType } = req.body;
            const user = await UserDetails.findOne({
                where: { userId: userId },
            });
            if (user) {
                await user.update({ careerType: careerType });
                res.status(201).json({
                    success: 1,
                    message: "Career has been updated",
                });
            } else {
                res.status(404).json({ success: 0, message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({
                error: error.message,
            });
        }
    },
    formSeven: async (req, res) => {
        try {
            const { userId, industry, skills, experience, tools } = req.body;
            const user = await UserDetails.findOne({
                where: { userId: userId },
            });
            if (user) {
                if (user.careerInfo) {
                    await CareerInfo.update(
                        { industry, skills, experience, tools },
                        { where: { id: user.careerInfo } }
                    );
                } else {
                    const careerInfo = await CareerInfo.create({
                        industry,
                        skills,
                        experience,
                        tools,
                    });
                    await user.update({ careerInfo: careerInfo.id });
                }
                res.status(201).json({
                    success: 1,
                    message: "CareerInfo created/updated successfully",
                });
            } else {
                res.status(404).json({ success: 0, error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
    formEight: async (req, res) => {
        try {
            const { userId, language, country, state, city } = req.body;

            const user = await UserDetails.findOne({
                where: { userId: userId },
            });
            if (user) {
                if (user.personalInfo) {
                    await PersonalInfo.update(
                        { language, country, state, city },
                        { where: { id: user.personalInfo } }
                    );
                } else {
                    const personalInfo = await PersonalInfo.create({
                        language,
                        country,
                        state,
                        city,
                    });
                    await user.update({ personalInfo: personalInfo.id });
                }
                res.status(201).json({
                    success: 1,
                    message: "PersonalInfo created/updated successfully",
                });
            } else {
                res.status(404).json({ success: 0, error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ success: 0, error: error.message });
        }
    },
};
