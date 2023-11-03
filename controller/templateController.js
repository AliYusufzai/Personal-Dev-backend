const path = require("path");
const Template = require("../model/template");
const cloudinary = require("../middleware/cloudinaryConfig");
const User = require("../model/user");
const BackInfo = require("../model/careerInfo");
const BackInfoTwo = require("../model/personalInfo");

//ADMIN API
// const fileUpload = async (req, res) => {
//     try {
//         const templateEntry = new Template();

//         if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//                 const fileName = file.filename;

//                 if (file.fieldname === "imageUrl") {
//                     templateEntry.imageUrl = `/uploads/${fileName}`;
//                 } else if (file.fieldname === "filePath") {
//                     const fileEntryPath = path.join(
//                         __dirname,
//                         "uploads",
//                         fileName
//                     );
//                     templateEntry.filePath = fileEntryPath;
//                 }
//             }
//         }

//         await templateEntry.save();
//         res.status(200).json({
//             message: "Template has been saved successfully",
//         });
//     } catch (error) {
//         console.error("Error:", error); // Log the error for debugging
//         res.status(500).json({ error: error.message });
//     }
// };
const fileUpload = async (req, res) => {
    try {
        const templateEntry = new Template();
        let fileEntryPath = null;

        if (req.file) {
            const fileName = req.file.filename;
            // Update this line to point to the correct root directory
            const rootDirectory =
                "C:\\Users\\Naaz\\Desktop\\Ali\\pd-initial-work"; // Replace with your actual root directory

            fileEntryPath = path.join(rootDirectory, "uploads", fileName);
        }

        templateEntry.filePath = fileEntryPath;

        await templateEntry.save();
        res.status(200).json({
            message: "Template has been saved successfully",
        });
    } catch (error) {
        console.error("Error:", error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

const updateFile = async (req, res) => {
    const { fileId } = req.params;
    try {
        const templateEntry = await Template.findOne({ _id: fileId });

        if (!templateEntry) return "Template not found";

        if (req.file) {
            const fileName = req.file.filename;
            fileEntryPath = path.join(__dirname, "uploads", fileName);
        }

        // Update the filePath of the existing entry
        templateEntry.filePath = fileEntryPath;

        // Save the updated entry
        await templateEntry.save();

        res.status(200).json({
            message: "Template has been updated successfully",
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const imageUpload = async (req, res) => {
    const { fileId } = req.params;
    try {
        const templateEntry = await Template.findById(fileId);
        if (!templateEntry) {
            return res.status(404).json({ error: "Template entry not found" });
        }
        let imgUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imgUrl = result.secure_url;
        }
        templateEntry.imageUrl = imgUrl;
        await templateEntry.save();
        res.status(200).json({
            message: "Image uploaded successfully",
            templateEntry,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Image upload failed" });
    }
};

//USER API
//GET
const getFile = async (req, res) => {
    try {
        const getTemplate = await Template.find();
        res.status(200).json(getTemplate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//USER API
//POST - user will be able to select his
//desired template and the Id of template gets saved in user mode
const selectFile = async (req, res) => {
    const { fileId } = req.body;
    const { userId } = req.params;
    try {
        const selectTemplate = await Template.findById(fileId);
        if (!selectTemplate) {
            return res.status(404).json("Template not found");
        }
        await User.findByIdAndUpdate(userId, {
            $addToSet: { favourite: fileId },
        });

        res.status(200).json({ message: "Template added to favourites" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//USER API
//POST - User will be able to choose the color of his choice
// it gets saved in user model with the actual hexadecimal color value
const selectColor = async (req, res) => {
    const { colorVal } = req.body;
    const { userId } = req.params;
    try {
        const updateColor = await User.findByIdAndUpdate(
            userId,
            { color: colorVal },
            { new: true }
        );
        if (!updateColor) {
            return res.status(404).json({ message: "Entry not found" });
        }
        res.status(200).json(updateColor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//USER API
//POST - User will be able to choose the font of his choice
// it gets saved in user model
const selectFont = async (req, res) => {
    const { fontName } = req.body;
    const { userId } = req.params;
    try {
        const updateFont = await User.findByIdAndUpdate(
            userId,
            { font: fontName },
            { new: true }
        );
        if (!updateFont) {
            return res.status(404).json({ message: "Entry not found" });
        }
        res.status(200).json(updateFont);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//USER API
//POST - User will be able to choose if It is for his businnes
// or is it for his job purpose
const selectProfession = async (req, res) => {
    const { userId } = req.params;
    const { checkboxValue } = req.body;
    try {
        const updateProfession = await User.findById(userId);
        if (checkboxValue !== undefined) {
            updateProfession.checkboxTwo = checkboxValue;
            await updateProfession.save();
            res.status(200).json(updateProfession);
        } else {
            res.status(400).json({
                message: "Invalid checkbox value provided",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

//USER API
//POST - User will be able to add industry, level of experience
// his skills set and the tools he can operate
const backgroundInfo = async (req, res) => {
    const { userId } = req.params;
    try {
        const { industry, skills, experience, tools } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.background) {
            const existingInfo = await BackInfo.findById(user.background);
            if (existingInfo) {
                existingInfo.industry = industry;
                existingInfo.skills = skills;
                existingInfo.experience = experience;
                existingInfo.tools = tools;

                await existingInfo.save();
            }
        } else {
            const newInfo = new BackInfo({
                industry,
                skills,
                experience,
                tools,
            });
            await newInfo.save();

            user.background = newInfo._id;
            await user.save();
        }

        res.status(201).json({ message: "Background Info has been updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//USER API
//POST - User will be able to save his native language
//his address related to the state and the country
const backgroundInfoTwo = async (req, res) => {
    const { userId } = req.params;
    try {
        const { language, country, state, city } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.backgroundTwo) {
            const existingInfo = await BackInfoTwo.findById(user.backgroundTwo);
            if (existingInfo) {
                existingInfo.language = language;
                existingInfo.country = country;
                existingInfo.state = state;
                existingInfo.city = city;

                await existingInfo.save();
            }
        } else {
            const newInfo = new BackInfoTwo({
                language,
                country,
                state,
                city,
            });
            await newInfo.save();
            user.backgroundTwo = newInfo._id;
            await user.save();
        }

        res.status(201).json({
            message: "Background Info Two has been updated",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    fileUpload,
    updateFile,
    imageUpload,
    getFile,
    selectFile,
    selectColor,
    selectFont,
    selectProfession,
    backgroundInfo,
    backgroundInfoTwo,
};
