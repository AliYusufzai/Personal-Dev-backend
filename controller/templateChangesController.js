const path = require("path");
const { exec } = require("child_process");
const fsPromises = require("fs/promises");
const Template = require("../model/template");
const User = require("../model/user");
const UserTemplate = require("../model/userTemplate");
// const config = require("../config");

const rootDirectory = "C:\\Users\\Naaz\\Desktop\\Ali\\pd-initial-work";

//DESC - GET API
//Get user template and user's data
const getUserTemplate = async (req, res) => {
    const { userId } = req.params;
    try {
        const userData = await User.findById(userId)
            .populate("background")
            .populate("backgroundTwo")
            .exec();
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        const favouriteArray = userData.favourite;
        if (favouriteArray.length === 0) {
            return res
                .status(404)
                .json({ message: "No Favourite template found" });
        }
        const mostRecent = favouriteArray[favouriteArray.length - 1];
        const templateData = await Template.findOne({ _id: mostRecent });
        if (!templateData) {
            return res.status(404).json({
                message: "Template not found for the most recent file",
            });
        }
        const filePath = templateData.filePath.split("\\");
        const fileName = filePath[filePath.length - 1];

        return res.status(200).json({
            userData,
            templateData,
            fileName,
        });
    } catch (error) {
        console.error(error.message);
    }
};

//DESC - PATCH API
//Updating user template
const updateUserTemplate = async (req, res) => {
    const { fileName, userData } = req.body;
    const { userId } = req.params;

    try {
        const currentDate = new Date();
        const shortDate = currentDate.toISOString().split("T")[0];
        const userSpecificFileName = `user_${userId}_${shortDate}_${fileName}`;
        const originalFilePath = path.join(rootDirectory, "uploads", fileName);
        const userSpecificFilePath = path.join(
            rootDirectory,
            "uploads",
            userSpecificFileName
        );

        await fsPromises.copyFile(originalFilePath, userSpecificFilePath);
        let fileContent = await fsPromises.readFile(
            userSpecificFilePath,
            "utf-8"
        );

        const unnestedUserData = {
            ...userData,
            ...userData.background,
            ...userData.backgroundTwo,
        };
        for (const key in unnestedUserData) {
            if (unnestedUserData.hasOwnProperty(key)) {
                const placeholder = `{{${key}}}`;
                const replacement = unnestedUserData[key];
                fileContent = fileContent.replace(
                    new RegExp(placeholder, "g"),
                    replacement
                );
            }
        }

        await fsPromises.writeFile(userSpecificFilePath, fileContent, "utf-8");
        // const userSpecificData = await UserTemplate.findOne({ userId: userId });
        // if (userSpecificData) {
        //     userSpecificData.templateFilePath.push(userSpecificFilePath);
        //     await userSpecificData.save();
        // } else {
        //     const newUserSpecificData = new UserTemplate({
        //         userId: userId,
        //         templateFilePath: [userSpecificFilePath],
        //     });
        //     await newUserSpecificData.save()
        // }

        const userSpecificData = await UserTemplate.findOneAndUpdate(
            { userId: userId },
            { $push: { templateFilePath: userSpecificFilePath } },
            { upsert: true, new: true }
        );
        await userSpecificData.save();
        res.status(200).send("File updated successfully.");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("An error occurred while updating the file.");
    }
};

const openUserTemplate = async (req, res) => {
    const { userId } = req.params;

    try {
        const userSpecificFile = await UserTemplate.findOne({ userId });
        if (!userSpecificFile) {
            return res
                .status(404)
                .json({ message: "User-specific file not found" });
        }

        const { templateFilePath } = userSpecificFile;
        const newTemplate = templateFilePath[templateFilePath.length - 1];
        exec(`start ${newTemplate}`);
        res.status(200).json({ message: "File opened in a new tab" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

const getUserSpecificTemplate = async (req, res) => {
    const { userId } = req.params;
    try {
        const userSpecificData = await UserTemplate.findOne({
            userId: userId,
        });
        if (!userSpecificData)
            return res.status(404).json("No template found for this user");
        const userFilePath = userSpecificData.templateFilePath;
        res.status(201).json({ userFilePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const displayUserSpecificTemplate = async (req, res) => {
    try {
        const { userFilePath } = req.query;
        // console.log("userFilePath:", req.query.userFilePath);
        if (!Array.isArray(userFilePath) || userFilePath.length === 0) {
            throw new Error("There is no file found");
        }
        const getMostRecentFile = async (filePaths) => {
            const fileStats = await Promise.all(
                filePaths.map(async (filePath) => {
                    const stats = await fsPromises.stat(filePath);
                    return { filePath, mtimeMs: stats.mtimeMs };
                })
            );
            return fileStats.reduce((prev, current) =>
                prev.mtimeMs > current.mtimeMs ? prev : current
            ).filePath;
        };
        const mostRecent = await getMostRecentFile(userFilePath);
        const htmlContent = await fsPromises.readFile(mostRecent, "utf-8");
        res.send(htmlContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserTemplate,
    updateUserTemplate,
    openUserTemplate,
    getUserSpecificTemplate,
    displayUserSpecificTemplate,
};
