const getRazorpay = require("../config/razorpay");
const Enroll = require("../model/enrollment.model");
const Payment = require("../model/payment.model");
const crypto = require('crypto');
const generateEnrollmentNo = require("../servicer/Enrollment");
const Cart = require("../model/cart.model");

const getAllPayment = async (req, res) => {
    try {
        const payment = await Payment.find();

        if (!payment) {
            return res.status(400).json({ data: null, meassage: "AllPayment Not added" })
        }

        return res.status(200).json({ data: payment, meassage: "AllPayment added Sucessfully" })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const getPayment = async (req, res) => {
    try {
        const payment = await Payment.find(req.params.id)

        if (!payment) {
            return res.status(400).json({ data: null, message: "Payment Not get" })
        }

        res.status(200).json({ data: payment, message: 'Payment Sucess get' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const addPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body)

        if (!payment) {
            return res.status(400).json({ data: null, message: "Payment Not added" })
        }

        res.status(200).json({ data: payment, message: 'Payment Sucessfully Added' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id)

        if (!payment) {
            return res.status(400).json({ data: null, message: "Payment Not Delete" })
        }

        res.status(200).json({ data: payment, message: 'Payment Sucess Delete' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const upadatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!payment) {
            return res.status(400).json({ data: null, message: "Payment Not Upadte" })
        }

        res.status(200).json({ data: payment, message: 'Payment Sucess Update' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const CreateOrder = async (req, res) => {
    try {
        const { amount, cart_id, user_id } = req.body;

        const options = {
            amount: Number(amount),
            currency: "INR"
        };

        const Order = await getRazorpay().orders.create(options);

        const payment = await Payment.create({
            orderId: Order?.id,
            amount: Order?.amount,
            status: 'pending',
            user_id,
            cart_id,
        })

        res.status(200).json({
            success: true,
            Order,
            key: process.env.RAZORPAY_API_KEY
        });

    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.message })
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isValidSignature = expectedSignature === razorpay_signature;

        if (!isValidSignature) {
            return res.status(400).json({
                success: false,
                message: "payment verification fail"
            });
        }

        let paymentData = await Payment.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: "completed"
            },
            { new: true }
        );

        if (!paymentData) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        const cart = await Cart.findById(paymentData.cart_id);
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found associated with this payment"
            });
        }

        const courseIds = cart.items.map(item => ({ course_id: item.course_id }));

        const existingEnrollment = await Enroll.findOne({
            paymentId: razorpay_payment_id
        });

        if (!existingEnrollment) {
            const enrollmentNo = await generateEnrollmentNo();

            await Enroll.create({
                user_id: paymentData.user_id,
                course: courseIds,
                paymentId: razorpay_payment_id,
                enrollment_no: enrollmentNo,
                payment_status: "completed"
            });
        }

        cart.status = "completed";
        await cart.save();

        return res.status(200).json({
            success: true,
            data: paymentData,
            message: "Payment verified "
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message
        });
    }
};
module.exports = {
    deletePayment,
    upadatePayment,
    addPayment,
    getPayment,
    getAllPayment,
    CreateOrder,
    verifyPayment,
}
