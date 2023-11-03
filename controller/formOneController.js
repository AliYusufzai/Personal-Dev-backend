const User = require("../model/user");
const Background = require("../model/careerInfo");

const formOne = async (req, res) => {
    const { name, email, phonenumber } = req.body;
    try {
        let formEntry;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            existingUser.name = name;
            existingUser.phonenumber = phonenumber;
            await existingUser.save();
            formEntry = existingUser;
        } else {
            formEntry = await User({ name, email, phonenumber });
            await formEntry.save();
        }

        res.status(201).json({
            message: "User Data Saved Successfully",
            user: formEntry,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Internal server error");
    }
};

const formTwo = async (req, res) => {
    const { userId } = req.params;
    const { checkboxValue } = req.body;

    try {
        const formEntry = await User.findById(userId);

        if (checkboxValue !== undefined) {
            formEntry.checkbox = checkboxValue;
            await formEntry.save();
            res.status(200).json(formEntry);
        } else {
            res.status(400).json({
                message: "Invalid checkbox value provided",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the checkbox",
            error: error.message,
        });
    }
};

module.exports = { formOne, formTwo };
