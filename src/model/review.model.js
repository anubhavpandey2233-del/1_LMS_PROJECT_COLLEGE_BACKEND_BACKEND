
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "coruse",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        description: {
            type: String,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
