const { default: mongoose, sanitizeFilter } = require("mongoose");

const contentSchema = new mongoose.Schema(
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
            // require:true
        },
        content_file: [{
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
            type: {
                type: String
            }
        }],
        type: {
            type: String
        },
        order: {
            type: String
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

const Content = mongoose.model("content", contentSchema)

module.exports = Content;