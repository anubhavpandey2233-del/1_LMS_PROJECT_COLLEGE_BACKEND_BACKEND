const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Types.ObjectId,
            ref: 'course',
        },
        user: {
           type: mongoose.Types.ObjectId,
            ref: 'users',
        },
        rating: {
            type: Number
        },
        description:{
            type:String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Review = mongoose.model('review', reviewSchema);
module.exports = Review  