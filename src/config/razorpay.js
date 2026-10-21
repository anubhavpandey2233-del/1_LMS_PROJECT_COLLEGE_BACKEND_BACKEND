const Razorpay = require("razorpay");

let instance;

const getRazorpay = () => {
    if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error(
            "Razorpay is not configured.Set RAZORPAY_API_KEY and RAZORPAY_KEY_SECRET."
        );
    }

    if (!instance) {
        instance = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    return instance;
};

module.exports = getRazorpay;
