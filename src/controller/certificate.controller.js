
const dayjs = require("dayjs");
const Course = require("../model/coruse.model");
const User = require("../model/user.model");
const Certificate = require("../model/certificate.model");
const createCertificate = require("../servicer/certificate");




const generateCertificate = async (req, res) => {
    console.log("\n========================================");
    console.log("🔥 CERTIFICATE API HIT");
    console.log("========================================");

    console.log("📥 Certificate Request Body:", req.body);

    try {
        const { course, user, grade, issue_date } = req.body;

        console.log("➡️ Course ID:", course);
        console.log("➡️ User ID:", user);
        console.log("➡️ Grade:", grade);
        console.log("➡️ Issue Date:", issue_date);

        if (!course || !user) {
            console.log("❌ Course or User ID is missing");

            return res.status(400).json({
                success: false,
                message: "Course and user are required"
            });
        }

        console.log("🔍 Finding course...");

        const courseData = await Course.findById(course);

        console.log("📚 Course Data:", courseData);

        if (!courseData) {
            console.log("❌ Course not found:", course);

            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        console.log("🔍 Finding user...");

        const userData = await User.findById(user);

        console.log("👤 User Data:", userData);

        if (!userData) {
            console.log("❌ User not found:", user);

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("🔍 Checking existing certificate...");

        const existingCertificate = await Certificate.findOne({
            course,
            user
        });

        console.log(
            "📜 Existing Certificate:",
            existingCertificate
        );

        if (existingCertificate) {
            console.log("✅ Certificate already exists");

            return res.status(200).json({
                success: true,
                data: existingCertificate.certificate_url,
                certificate: existingCertificate,
                message: "Certificate already exists."
            });
        }

        const certificateDate = issue_date || new Date();

        console.log("📅 Certificate Date:", certificateDate);

        console.log("📄 Starting PDF generation...");

        const pdf = await createCertificate({
            username: userData.name,
            courseName: courseData.name,
            grade: grade || "A+",
            issueDate: certificateDate
        });

        console.log("✅ PDF generation completed");
        console.log("📄 PDF URL:", pdf);

        if (!pdf) {
            console.log("❌ PDF URL is empty");

            return res.status(500).json({
                success: false,
                message: "Certificate PDF URL was not generated"
            });
        }

        console.log("💾 Saving certificate to MongoDB...");

        const certificate = await Certificate.create({
            course,
            user,
            grade: grade || "A+",
            issue_date: certificateDate,
            certificate_url: pdf
        });

        console.log("✅ Certificate saved successfully");
        console.log("📜 Certificate Data:", certificate);

        console.log("🎉 Sending certificate response...");

        return res.status(200).json({
            success: true,
            data: certificate.certificate_url,
            certificate,
            message: "Certificate created successfully."
        });

    } catch (error) {
        console.error("\n========================================");
        console.error("❌ CERTIFICATE GENERATION ERROR");
        console.error("========================================");

        console.error("❌ Error Name:", error.name);
        console.error("❌ Error Message:", error.message);
        console.error("❌ Error Code:", error.code);
        console.error("❌ Error Stack:", error.stack);

        if (error.code === 11000) {
            console.log("⚠️ Duplicate certificate detected");

            const existingCertificate = await Certificate.findOne({
                course: req.body.course,
                user: req.body.user
            });

            console.log(
                "🔍 Existing certificate after duplicate error:",
                existingCertificate
            );

            if (existingCertificate) {
                console.log("✅ Returning existing certificate");

                return res.status(200).json({
                    success: true,
                    data: existingCertificate.certificate_url,
                    certificate: existingCertificate,
                    message: "Certificate already exists."
                });
            }
        }

        console.error("❌ Sending 500 response to frontend");

        return res.status(500).json({
            success: false,
            message: "Failed to generate certificate",
            error: error.message
        });
    }
};



const getMyCertificates = async (req, res) => {
    try {
       const user = req.user._id;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const certificates = await Certificate.find({ user })
            .populate("course", "name course_img")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: certificates,
            message: "Certificates fetched successfully"
        });

    } catch (error) {
        console.error("Get Certificates Error:", error);

        return res.status(500).json({
            success: false,
            data: [],
            message: error.message
        });
    }
};



module.exports = {
    generateCertificate,
    getMyCertificates
};





// const dayjs = require("dayjs");
// const Course = require("../model/coruse.model");
// const User = require("../model/user.model");
// const Certificate = require("../model/certificate.model");
// const createCertificate = require("../servicer/certificate");

// const generateCertificate = async (req, res) => {
//     const { course, user, grade, issue_date } = req.body;

//     const courseData = await Course.findById(course);
//     const userData = await User.findById(user);

//     if (!courseData || !userData) {
//         return res.status(404).json({
//             success: false,
//             message: "Course or user not found"
//         });
//     }

//     const certificate = await Certificate.create({
//         course,
//         user,
//         grade,
//         issue_date
//     });

//     const pdf = await createCertificate({
//         username: userData.name,
//         courseName: courseData.name,
//         grade: grade,
//         issueDate: issue_date || dayjs().format("DD MMMM YYYY"),
//     });

//     console.log("pdf", pdf);

//     return res.status(200).json({
//         success: true,
//         data : pdf,
//         message: "certificate Created."
//     });
// };



// module.exports = {
//     generateCertificate
// }
