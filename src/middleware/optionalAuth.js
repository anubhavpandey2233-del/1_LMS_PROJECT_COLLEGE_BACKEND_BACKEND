
const users = require("../model/user.model");
const jwt = require("jsonwebtoken");

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        const token =
            req.cookies?.accessToken ||
            (authHeader
                ? authHeader.replace(/^Bearer:?\s+/i, "").trim()
                : null);

        if (!token) {
            req.user = null;
            return next();
        }

        const decode = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await users.findById(decode._id);

        req.user = user || null;

        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
};

module.exports = optionalAuth;
