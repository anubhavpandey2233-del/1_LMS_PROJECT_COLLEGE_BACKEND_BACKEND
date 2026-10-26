
const mongoose = require("mongoose");
const Enroll = require("../model/enrollment.model");

const getEnroll = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid enrollment ID is required",
            });
        }

        const enroll = await Enroll.findById(id)
            .populate("course_id")
            .populate("user_id");

        if (!enroll) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Enrollment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: enroll,
            message: "Enrollment fetched successfully",
        });
    } catch (error) {
        console.error("Get enrollment error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getAllEnroll = async (req, res) => {
    try {
        const enroll = await Enroll.find()
            .populate("course_id")
            .populate("user_id")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: enroll,
            message: "Enrollments fetched successfully",
        });
    } catch (error) {
        console.error("Get all enrollments error:", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error",
        });
    }
};

const addEnroll = async (req, res) => {
    try {
        const { course_id, user_id } = req.body;

        if (
            !course_id ||
            !user_id ||
            !mongoose.Types.ObjectId.isValid(course_id) ||
            !mongoose.Types.ObjectId.isValid(user_id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid course_id and user_id are required",
            });
        }

        const existingEnroll = await Enroll.findOne({
            course_id,
            user_id,
        });

        if (existingEnroll) {
            return res.status(409).json({
                success: false,
                alreadyEnrolled: true,
                message: "You are already enrolled in this course",
                data: existingEnroll,
            });
        }

        const enroll = await Enroll.create({
            course_id,
            user_id,
            enrollment_no: `ENR-${new mongoose.Types.ObjectId()}`,
        });

        return res.status(201).json({
            success: true,
            message: "You enrolled successfully!",
            data: enroll,
        });
    } catch (error) {
        console.error("Add enrollment error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                alreadyEnrolled: true,
                message: "You are already enrolled in this course",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getUserEnrollments = async (req, res) => {
    try {
        const { user_id } = req.params;

        console.log("User ID:", user_id);

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({
                success: false,
                message: "Valid user ID is required",
            });
        }

        const enrollments = await Enroll.find({ user_id })
            .populate("course_id")
            .sort({ createdAt: -1 });

        console.log("Enrollments:", enrollments);

        return res.status(200).json({
            success: true,
            data: enrollments,
            message: "User enrollments fetched successfully",
        });
    } catch (error) {
        console.error("Get user enrollments error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateEnroll = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid enrollment ID is required",
            });
        }

        const enrollData = await Enroll.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!enrollData) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enrollment updated successfully",
            data: enrollData,
        });
    } catch (error) {
        console.error("Update enrollment error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const deleteEnroll = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid enrollment ID is required",
            });
        }

        const enroll = await Enroll.findByIdAndDelete(id);

        if (!enroll) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully",
            data: enroll,
        });
    } catch (error) {
        console.error("Delete enrollment error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getEnroll,
    getAllEnroll,
    addEnroll,
    updateEnroll,
    deleteEnroll,
    getUserEnrollments,
};








// const Enroll = require("../model/enrollment.model");
// const secrionsModel = require("../model/section.model");

// const getEnroll = async (req, res) => {
//     try {
//         const enroll = await Enroll.findById(req.params.id);

//         res
//             .status(200)
//             .json({ sucess: true, data: enroll, message: "get sucessfully" });
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 data: null,
//                 message: "Internal Server Error: " + error.meassage,
//             });
//     }
// };

// const getAllEnroll = async (req, res) => {
//     console.log("terms Routes");
//     try {
//         const enroll = await Enroll.find();

//         res
//             .status(200)
//             .json({ sucess: true, data: enroll, message: "get sucessfully" });
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 data: null,
//                 message: "Internal Server Error: " + error.meassage,
//             });
//     }
// };

// const addEnroll = async (req, res) => {
//     try {
//         const enroll = await Enroll.create(req.body);

//         res.status(200).json({
//             success: true,
//             message: "enroll added successfully",
//             data: enroll,
//         });
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 data: null,
//                 message: "Internal Server Error: " + error.meassage,
//             });
//     }
// };

// const updateEnroll = async (req, res) => {
//     try {


//         const enrollData = await Enroll.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });

//         if (!enrollData) {
//             return res
//                 .status(404)
//                 .json({ data: null, message: "enroll not updated" });
//         }

//         res.status(200).json({
//             success: true,
//             message: "enroll update successfully",
//             data: enrollData,
//         });
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 data: null,
//                 message: "Internal Server Error: " + error.meassage,
//             });
//     }
// };

// const deleteEnroll = async (req, res) => {
//     try {

//         const enroll = await Enroll.findByIdAndDelete(req.params.id);

//         if (!enroll) {
//             return res
//                 .status(404)
//                 .json({ data: null, message: "enroll not deleted" });
//         }
//         res.status(200).json({
//             success: true,
//             message: "enroll delete successfully",
//             data: null,
//         });
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 data: null,
//                 message: "Internal Server Error: " + error.meassage,
//             });
//     }
// };

// module.exports = {
//     getEnroll,
//     getAllEnroll,
//     addEnroll,
//     updateEnroll,
//     deleteEnroll,
// };
