require("dotenv").config();
const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        try {
            let token = req.header("Authorization");

            if (!token) {
                return res
                    .status(401)
                    .json({ success: 0, message: "Unauthorized" });
            } else {
                token = token.split(" ")[1];
                verify(token, process.env.JWT_SEC, (error, decode) => {
                    if (error) {
                        console.error("Could not verify: ", error.message);
                        return res.status(401).json({
                            success: 0,
                            message: "Invalid Token",
                        });
                    } else {
                        req.auth_user = decode.user;
                        //console.log("auth_user: ", req.auth_user);
                        next();
                    }
                });
            }
        } catch (error) {
            console.error("Error during authentication: ", error.message);
            return res
                .status(500)
                .json({ success: 0, message: "Internal Server Error" });
        }
    },
};
