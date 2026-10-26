
const Coruse = require("../model/coruse.model");
const {
    uploadcloudinary,
    deletecloudinary
} = require("../servicer/cloudinary");
const mongoose = require("mongoose");
const Review = require("../model/review.model");
const Enroll = require("../model/enrollment.model");


const addCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const Files = req.files || [];
        const uploadedImages = [];

        for (const course_img of Files) {
            const cloudinaryObj = await uploadcloudinary(
                course_img.path,
                "Course"
            );

            uploadedImages.push({
                public_id: cloudinaryObj.public_id,
                url: cloudinaryObj.url
            });
        }

        const coruse = await Coruse.create({
            ...req.body,
            course_img: uploadedImages
        });

        const populatedCourse = await Coruse.findById(coruse._id)
            .populate("intrucotor_id", "name email pfp");

        return res.status(201).json({
            sucess: true,
            data: populatedCourse,
            Message: "Course data added successfully."
        });
    } catch (error) {
        console.error("Add course error:", error);
        return res.status(500).json({
            sucess: false,
            data: null,
            Message: "Internal Server Error: " + error.message
        });
    }
};

const getAllCouser = async (req, res) => {
    try {
        const courses = await Coruse.find()
            .populate("intrucotor_id", "name email pfp");

        const coursesWithDetails = await Promise.all(
            courses.map(async (course) => {
                const [ratingData, totalStudents] = await Promise.all([
                    Review.aggregate([
                        {
                            $match: {
                                course: course._id
                            }
                        },
                        {
                            $group: {
                                _id: "$course",
                                averageRating: { $avg: "$rating" },
                                totalRatings: { $sum: 1 }
                            }
                        }
                    ]),
                    Enroll.countDocuments({
                        course_id: course._id,
                        payment_status: "paid"
                    })
                ]);

                const averageRating = ratingData[0]?.averageRating ?? 0;
                const totalRatings = ratingData[0]?.totalRatings ?? 0;

                console.log("Course:", course._id);
                console.log("Rating data:", ratingData);
                console.log("Students enrolled:", totalStudents);

                return {
                    ...course.toObject(),
                    averageRating: Number(averageRating.toFixed(1)),
                    totalRatings,
                    totalStudents
                };
            })
        );

        return res.status(200).json({
            sucess: true,
            data: coursesWithDetails,
            Message: "Course data fetched."
        });
    } catch (error) {
        console.error("Get all courses error:", error);

        return res.status(500).json({
            sucess: false,
            data: null,
            Message: error.message
        });
    }
};
const getCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const coruse = await Coruse.findById(req.params.id)
            .populate("intrucotor_id", "name email pfp");

        if (!coruse) {
            return res.status(404).json({
                sucess: false,
                data: null,
                Message: "Course not found."
            });
        }

        return res.status(200).json({
            sucess: true,
            data: coruse,
            Message: "Course data fetched."
        });
    } catch (error) {
        console.error("Get course error:", error);
        return res.status(500).json({
            sucess: false,
            data: null,
            Message: error.message
        });
    }
};

const updateCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const courseData = await Coruse.findById(req.params.id);

        if (!courseData) {
            return res.status(404).json({
                sucess: false,
                data: null,
                Message: "Course not found."
            });
        }

        const uData = {
            ...req.body,
            course_img: courseData.course_img
        };

        const Files = req.files || [];

        if (Files.length > 0) {
            for (const image of courseData.course_img || []) {
                if (image.public_id) {
                    await deletecloudinary(image.public_id);
                }
            }

            const uploadedImages = [];

            for (const course_img of Files) {
                const cloudinaryObj = await uploadcloudinary(
                    course_img.path,
                    "Course"
                );

                uploadedImages.push({
                    public_id: cloudinaryObj.public_id,
                    url: cloudinaryObj.url
                });
            }

            uData.course_img = uploadedImages;
        }

        const coruse = await Coruse.findByIdAndUpdate(
            req.params.id,
            uData,
            {
                new: true,
                runValidators: true
            }
        ).populate("intrucotor_id", "name email pfp");

        return res.status(200).json({
            sucess: true,
            data: coruse,
            Message: "Course data updated."
        });
    } catch (error) {
        console.error("Update course error:", error);
        return res.status(500).json({
            sucess: false,
            data: null,
            Message: error.message
        });
    }
};

const deletCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const coruse = await Coruse.findByIdAndDelete(req.params.id);

        if (!coruse) {
            return res.status(404).json({
                sucess: false,
                data: null,
                Message: "Course not found."
            });
        }

        for (const image of coruse.course_img || []) {
            if (image.public_id) {
                await deletecloudinary(image.public_id);
            }
        }

        return res.status(200).json({
            sucess: true,
            data: coruse,
            Message: "Course data deleted."
        });
    } catch (error) {
        console.error("Delete course error:", error);
        return res.status(500).json({
            sucess: false,
            data: null,
            Message: error.message
        });
    }
};

const updateCouserStauts = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const coruse = await Coruse.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            {
                new: true,
                runValidators: true
            }
        ).populate("intrucotor_id", "name email pfp");

        if (!coruse) {
            return res.status(404).json({
                sucess: false,
                data: null,
                Message: "Course status not updated."
            });
        }

        return res.status(200).json({
            sucess: true,
            data: coruse,
            Message: "Course status updated."
        });
    } catch (error) {
        console.error("Update course status error:", error);
        return res.status(500).json({
            sucess: false,
            data: null,
            Message: error.message
        });
    }
};

module.exports = {
    addCouser,
    getAllCouser,
    getCouser,
    updateCouser,
    deletCouser,
    updateCouserStauts
};
