const { default: mongoose, sanitizeFilter } = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        },
        items: [{
            course_id: {
                type: mongoose.Types.ObjectId,
                ref: 'coruse'
            },
            price: {
                type: String
            }
        }],
        status: {
            type: String,
            default: "pending"

        }
    },
    {
        timestamps: true,
        versionKey: false,

    }
)

const Cart = mongoose.model("cart", cartSchema)

module.exports = Cart;