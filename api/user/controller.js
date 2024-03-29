require("dotenv").config();
const UserDetails = require("../../model/userDetails");
const Users = require("../../model/user");
const jwt = require("jsonwebtoken");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const CareerInfo = require("../../model/careerInfo");
const PersonalInfo = require("../../model/personalInfo");

module.exports = {
    signIn: async (req, res) => {
        try {
            let { email, password } = req.body;
            let existingUser = await Users.findOne({ where: { email } });

            var salt = genSaltSync(10);
            if (!existingUser) {
                password = hashSync(password, salt);
                existingUser = await Users.create({ email, password });
            } else {
                password = hashSync(password, salt);
                await existingUser.save();
            }

            const sanitizedUser = {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                phone: existingUser.phone,
            };

            const token = jwt.sign(
                { user: sanitizedUser },
                process.env.JWT_SEC,
                {
                    expiresIn: 20,
                }
            );

            res.status(200).send({
                success: 1,
                user: sanitizedUser,
                token: token,
                message: "New user registered and logged in successfully.",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: 0, message: error.message });
        }
    },
};
