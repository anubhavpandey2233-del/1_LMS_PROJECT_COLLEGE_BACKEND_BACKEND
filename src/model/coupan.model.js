const { default: mongoose, sanitizeFilter } = require("mongoose");

const coupanSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
        },
        discount: {
            type: String
        },
        minOrderAmount: {
            type: Number,
        },
        startDate: {
            type: Date,
        },
        expiryDate: {
            type: Date,
        },
        limit: {
            type: Number,
            default: 1,
        },
        usenumber: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
        versionKey: false,

    }
)

const Coupan = mongoose.model("coupan", coupanSchema)

module.exports = Coupan;