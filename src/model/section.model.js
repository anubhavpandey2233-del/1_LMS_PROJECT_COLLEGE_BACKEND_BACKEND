const { default: mongoose, sanitizeFilter } = require("mongoose");

const sectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        desciption: {
            type: String,
        },
        course_id: {
            type: mongoose.Types.ObjectId,
            ref: "coruse"
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    })

const Section = mongoose.model("section", sectionSchema)

module.exports = Section;