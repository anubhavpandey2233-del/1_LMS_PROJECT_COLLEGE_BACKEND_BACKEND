const { default: mongoose, sanitizeFilter } = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.Types.ObjectId,
            ref: 'cart'
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        orderId: {
            type: String
        },
        paymentId: {
            type: String
        },
        signature: {
            type: String
        },
        transactionId: {
            type: String
        },
        amount: {
            type: Number
        },
        status: {
            type: String,
        },
        datetime: {
            type: Date,

        }
    },
    {
        timestamps: true,
        versionKey: false,

    }
)

const Payment = mongoose.model("payment", paymentSchema)

module.exports = Payment;