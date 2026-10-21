const Enroll = require("../model/enrollment.model");
const enrollModel = require("../model/enrollment.model");

const generateEnrollmentNo = async () => {

    const now = new Date();

    // Last 2 digits of year
    const year = now.getFullYear().toString().slice(-2);

    // Current date
    const date = String(now.getDate()).padStart(2, '0');

    // Count today's enrollments
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const todayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );

    const count = await Enroll.countDocuments({
        createdAt: {
            $gte: todayStart,
            $lt: todayEnd
        }
    });

    // Sequence number
    const orderNo = String(count + 1).padStart(3, '0');

    return `EK${year}${date}${orderNo}`;
};

module.exports=generateEnrollmentNo;