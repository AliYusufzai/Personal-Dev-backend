require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) {
            res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        try {
            const decode = jwt.verify(
                token,
                process.env.JWT_SEC,
                (error, decode) => {
                    if (error) {
                        return res.json({
                            success: 0,
                            message: "Invalid Token",
                        });
                    } else {
                        req.auth_user = decode.existingUser;
                        next();
                    }
                }
            );
        } catch (error) {
            console.log("Error: ", error.message);
            return res.status(401).json({ message: "Invalid token" });
        }
    },
};
