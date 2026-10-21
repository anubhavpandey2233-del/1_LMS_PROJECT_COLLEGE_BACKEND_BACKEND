const dayjs = require("dayjs");
const Course = require("../model/coruse.model");
const User = require("../model/user.model");
const Certificate = require("../model/certificate.model");
const createCertificate = require("../servicer/certificate");

const generateCertificate = async (req, res) => {
    const { course, user, grade, issue_date } = req.body;

    const courseData = await Course.findById(course);
    const userData = await User.findById(user);

    if (!courseData || !userData) {
        return res.status(404).json({
            success: false,
            message: "Course or user not found"
        });
    }

    const certificate = await Certificate.create({
        course,
        user,
        grade,
        issue_date
    });

    const pdf = await createCertificate({
        username: userData.name,
        courseName: courseData.name,
        grade: grade,
        issueDate: issue_date || dayjs().format("DD MMMM YYYY"),
    });

    console.log("pdf", pdf);

    return res.status(200).json({
        success: true,
        data : pdf,
        message: "certificate Created."
    });
};



module.exports = {
    generateCertificate
}
