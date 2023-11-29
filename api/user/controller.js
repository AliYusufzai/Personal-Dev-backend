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

            if (!existingUser) {
                const salt = genSaltSync(10);
                password = hashSync(password, salt);
                existingUser = await Users.create({ email, password });
            } else {
                const passwordMatch = compareSync(
                    password,
                    existingUser.password
                );

                if (!passwordMatch) {
                    return res
                        .status(401)
                        .json({ success: 0, message: "Invalid password" });
                }
            }

            const sanitizedUser = {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                phone: existingUser.phone,
            };

            const token = jwt.sign(
                { userId: existingUser.id },
                process.env.JWT_SEC,
                {
                    expiresIn: "3d",
                }
            );
            res.cookie("jwt", token, { httpOnly: true });

            res.status(200).send({
                success: 1,
                user: sanitizedUser,
                token,
                message: "New user registered and logged in successfully.",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: 0, message: error.message });
        }
    },
};
