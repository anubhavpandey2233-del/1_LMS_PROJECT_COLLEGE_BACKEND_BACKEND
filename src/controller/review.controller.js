
const mongoose = require("mongoose");
const Review = require("../model/review.model");
const Enrollment = require("../model/enrollment.model");

const getAllreview = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name email pfp")
            .populate({
                path: "course",
                select: "name course_img intrucotor_id",
                populate: {
                    path: "intrucotor_id",
                    select: "name email"
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: reviews,
            message: "All review data fetched successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
};

const getreview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate("user", "name email pfp")
            .populate({
                path: "course",
                select: "name course_img intrucotor_id",
                populate: {
                    path: "intrucotor_id",
                    select: "name email"
                }
            });

        if (!review) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Review not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: review,
            message: "Review fetched successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
};

const addreview = async (req, res) => {
    try {
        const { course, rating, description } = req.body;
        const user = req.user?._id;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Please login first."
            });
        }

        if (!course || !rating || !description?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Course, rating and description are required."
            });
        }

        if (
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(course)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID."
            });
        }

        const enrollment = await Enrollment.findOne({
            user_id: user,
            course_id: course
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You can review only enrolled courses."
            });
        }

        const existingReview = await Review.findOne({
            user,
            course
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this course."
            });
        }

        const review = await Review.create({
            user,
            course,
            rating: Number(rating),
            description: description.trim()
        });

        const populatedReview = await Review.findById(review._id)
            .populate("user", "name email pfp")
            .populate({
                path: "course",
                select: "name course_img intrucotor_id",
                populate: {
                    path: "intrucotor_id",
                    select: "name email"
                }
            });

        return res.status(201).json({
            success: true,
            data: populatedReview,
            message: "Review added successfully."
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this course."
            });
        }

        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
};

const updatereview = async (req, res) => {
    try {
        const { rating, description } = req.body;

        if (
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5 ||
            !description?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid rating and description are required."
            });
        }

        const review = await Review.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            {
                rating: Number(rating),
                description: description.trim()
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("user", "name email pfp")
            .populate({
                path: "course",
                select: "name course_img intrucotor_id",
                populate: {
                    path: "intrucotor_id",
                    select: "name email"
                }
            });

        if (!review) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Review not found or you are not authorized."
            });
        }

        return res.status(200).json({
            success: true,
            data: review,
            message: "Review updated successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
};

const deletreview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Review not found or you are not authorized."
            });
        }

        return res.status(200).json({
            success: true,
            data: review,
            message: "Review deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
};

module.exports = {
    addreview,
    getAllreview,
    getreview,
    updatereview,
    deletreview
};




// const Review = require("../model/review.model");
// const Enrollment = require("../model/enrollment.model");

// const getAllreview = async (req, res) => {
//     try {
//         const reviews = await Review.find()
//             .populate("user", "name email")
//             .populate("course", "name course_img");

//         return res.status(200).json({
//             success: true,
//             data: reviews,
//             message: "All review data fetched successfully."
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             data: null,
//             message: error.message
//         });
//     }
// };

// const getreview = async (req, res) => {
//     try {
//         const review = await Review.findById(req.params.id)
//             .populate("user", "name email")
//             .populate("course", "name course_img");

//         if (!review) {
//             return res.status(404).json({
//                 success: false,
//                 data: null,
//                 message: "Review not found."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: review,
//             message: "Review fetched successfully."
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             data: null,
//             message: error.message
//         });
//     }
// };

// const addreview = async (req, res) => {
//     try {
//         const { course, rating, description } = req.body;
//         const user = req.user?._id;

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Please login first."
//             });
//         }

//         if (!course || !rating || !description?.trim()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Course, rating and description are required."
//             });
//         }

//         if (
//             !Number.isInteger(Number(rating)) ||
//             Number(rating) < 1 ||
//             Number(rating) > 5
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Rating must be between 1 and 5."
//             });
//         }

//         if (!require("mongoose").Types.ObjectId.isValid(course)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid course ID."
//             });
//         }

//         const enrollment = await Enrollment.findOne({
//             user_id: user,
//             course_id: course
//         });

//         if (!enrollment) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You can review only enrolled courses."
//             });
//         }

//         const existingReview = await Review.findOne({
//             user,
//             course
//         });

//         if (existingReview) {
//             return res.status(409).json({
//                 success: false,
//                 message: "You have already reviewed this course."
//             });
//         }

//         const review = await Review.create({
//             user,
//             course,
//             rating: Number(rating),
//             description: description.trim()
//         });

//         return res.status(201).json({
//             success: true,
//             data: review,
//             message: "Review added successfully."
//         });

//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(409).json({
//                 success: false,
//                 message: "You have already reviewed this course."
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             data: null,
//             message: error.message
//         });
//     }
// };

// const updatereview = async (req, res) => {
//     try {
//         const { rating, description } = req.body;

//         if (
//             !Number.isInteger(Number(rating)) ||
//             Number(rating) < 1 ||
//             Number(rating) > 5 ||
//             !description?.trim()
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Valid rating and description are required."
//             });
//         }

//         const review = await Review.findOneAndUpdate(
//             {
//                 _id: req.params.id,
//                 user: req.user._id
//             },
//             {
//                 rating: Number(rating),
//                 description: description.trim()
//             },
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );

//         if (!review) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Review not found or you are not authorized."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: review,
//             message: "Review updated successfully."
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             data: null,
//             message: error.message
//         });
//     }
// };

// const deletreview = async (req, res) => {
//     try {
//         const review = await Review.findOneAndDelete({
//             _id: req.params.id,
//             user: req.user._id
//         });

//         if (!review) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Review not found or you are not authorized."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: review,
//             message: "Review deleted successfully."
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             data: null,
//             message: error.message
//         });
//     }
// };

// module.exports = {
//     addreview,
//     getAllreview,
//     getreview,
//     updatereview,
//     deletreview
// };
