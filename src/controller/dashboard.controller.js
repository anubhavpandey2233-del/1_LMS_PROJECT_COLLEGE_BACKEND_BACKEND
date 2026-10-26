
const Users = require("../model/user.model");
const Course = require("../model/coruse.model");
const Enrollment = require("../model/enrollment.model");



exports.getDashboardStats = async (req, res) => {
  try {
    const [totalActiveUsers, totalCourses, enrollments] =
      await Promise.all([
        Users.countDocuments({
          is_active: true,
          role: { $nin: ["admin", "Admin"] }
        }),
        Course.countDocuments({ is_active: true }),
        Enrollment.find().select("course")
      ]);

    const totalEnrollments = enrollments.reduce(
      (total, enrollment) =>
        total + (enrollment.course?.length || 0),
      0
    );

    const enrollmentCourseIds = enrollments.flatMap(
      enrollment =>
        (enrollment.course || []).map(item => item.course_id)
    );

    const enrolledCourses = await Course.find({
      _id: { $in: enrollmentCourseIds }
    }).select("_id fees");

    const feeMap = new Map(
      enrolledCourses.map(course => [
        course._id.toString(),
        Number(course.fees) || 0
      ])
    );

    const totalRevenue = enrollments.reduce(
      (total, enrollment) =>
        total +
        (enrollment.course || []).reduce(
          (sum, item) =>
            sum + (feeMap.get(
              String(item.course_id || item)
            ) || 0),
          0
        ),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalActiveUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};
