const { default: mongoose } = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Types.ObjectId,
            ref: 'course',
        },
        user: {
           type: mongoose.Types.ObjectId,
            ref: 'user',
        },
        issue_date: {
            type: Date,
            default: Date.now
        },
        grade:{
            type:String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Certificate = mongoose.model('certificate', certificateSchema);
module.exports = Certificate  