const { string } = require("joi");
const { default: mongoose, sanitizeFilter } = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        course_id: {
            type: mongoose.Types.ObjectId,
            ref: "coruse",
        },
        section_id: {
            type: mongoose.Types.ObjectId,
            ref: "section",
        },
        name: {
            type: String,
            trim: true,
            required: true,
        },
        mark:{
            type:Number
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Quiz = mongoose.model("quiz", quizSchema)

module.exports = Quiz;