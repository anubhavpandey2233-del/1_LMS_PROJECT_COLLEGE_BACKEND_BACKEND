const { default: mongoose, sanitizeFilter } = require("mongoose");

const progessSchema = new mongoose.Schema(
    {
        enrollment_id : {
            type: mongoose.Types.ObjectId,
            ref: 'enrollment'
        },
        content_id: {
            type: mongoose.Types.ObjectId,
            ref: 'section'
        },
        duration: {
            type: String
        },
        is_completed: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const Progess = mongoose.model("progess", progessSchema)

module.exports = Progess;