const { default: mongoose, sanitizeFilter } = require("mongoose");

const coruseSchema = new mongoose.Schema(
    {
        categories_id: {
            type: mongoose.Types.ObjectId,
            ref: "categories",
            required: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        desciption: {
            type: String,
            trim: true
        },
        fees: {
            type: Number,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        intrucotor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        course_img: [{
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }],
        perview_url: {
            public_id: {
                type: String
            },
            url: {
                type: String
            }
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

const Coruse = mongoose.model("coruse", coruseSchema)

module.exports = Coruse;