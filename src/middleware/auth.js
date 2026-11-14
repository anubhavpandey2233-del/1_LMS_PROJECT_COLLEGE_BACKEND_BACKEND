
const users = require("../model/user.model");
const jwt = require("jsonwebtoken");

const auth = (role) => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        const token =
            req.cookies?.accessToken ||
            (authHeader
                ? authHeader.replace(/^Bearer:?\s+/i, "").trim()
                : null);

        if (!token) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Authentication token missing. Please login again."
            });
        }

        const decode = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await users.findById(decode._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "User not found."
            });
        }

        req.user = user;

        console.log("Allowed Roles:", role);
console.log("Logged In User Role:", user.role);

        if (!role.includes(user.role)) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "You do not have access to this resource."
            });
        }

        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);

        return res.status(401).json({
            success: false,
            data: null,
            message: "Invalid or expired authentication token."
        });
    }
};

module.exports = auth;





// const users = require("../model/user.model");
// const jwt = require("jsonwebtoken");
 
// const auth = (role) => async (req, res, next) => {
//     try {
//         const token =
//             req.cookies.accessToken ||
//             req.header("Authorization")?.replace("Bearer: ", "");

//         console.log(role, token);

//         const decode = await jwt.verify(
//             token,
//             process.env.ACCESS_TOKEN_SECRET,
//         );

//         console.log(decode);
        
//         const user = await users.findById(decode._id);

//         console.log(user);
        

//         if (!user) {
//             return res.status(400).json({
//                 sucess: false,
//                 data: [],
//                 message: "user not found",
//             });
//         }

//         req.user = user;
        
//         if (!role.includes(user.role)) {
//             return res.status(400).json({
//                 sucess: false,
//                 data: [],
//                 message: "You have not an acces for it.",
//             });
//         }

//         next();

//     } catch (error) {
//         return res
//             .status(500)
//             .json({
//                 sucess: false,
//                 data: null,
//                 Message: "Internal Server Error :" + error,
//             });
//     }
// };

// module.exports = auth;
