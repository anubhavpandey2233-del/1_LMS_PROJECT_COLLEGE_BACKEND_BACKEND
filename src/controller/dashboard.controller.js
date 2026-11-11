
const Users = require("../model/user.model");
const Course = require("../model/coruse.model");
const Enrollment = require("../model/enrollment.model");
const Review = require("../model/review.model");

// ADMIN DASHBOARD - All users, courses and enrollments
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalActiveUsers, totalCourses, totalEnrollments] =
      await Promise.all([
        Users.countDocuments({
          is_active: true,
          role: { $nin: ["admin", "Admin"] }
        }),
        Course.countDocuments({ is_active: true }),
        Enrollment.countDocuments()
      ]);

    const totalRevenue = await Enrollment.aggregate([
      {
        $match: {
          payment_status: "success"
        }
      },
      {
        $lookup: {
          from: "coruses",
          localField: "course_id",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: "$course" },
      {
        $group: {
          _id: null,
          total: { $sum: "$course.fees" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalActiveUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};

// INSTRUCTOR DASHBOARD - Only logged-in instructor's data
exports.getInstructorDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get only this instructor's active courses
    const courses = await Course.find({
      intrucotor_id: instructorId,
      is_active: true
    }).select("_id name fees duration course_img");

    const courseIds = courses.map(course => course._id);

    if (!courseIds.length) {
      return res.status(200).json({
        success: true,
        data: {
          totalCourses: 0,
          totalStudents: 0,
          enrolledStudents: 0,
          totalEnrollments: 0,
          averageRating: null,
          totalReviews: 0,
          currentMonthEarning: 0,
          lastMonthEarning: 0,
          earningPercentage: null,
          mostSellingCourses: []
        }
      });
    }

    // Get all enrollments for instructor's courses.
    // Sort oldest first so duplicate enrollments use the first enrollment date.
    const enrollments = await Enrollment.find({
      course_id: { $in: courseIds }
    })
      .select("course_id user_id enrollment_Date")
      .sort({ enrollment_Date: 1, _id: 1 })
      .lean();

    const courseMap = new Map(
      courses.map(course => [String(course._id), course])
    );

    // Count each student only once per course
    const uniqueEnrollmentMap = new Map();

    enrollments.forEach(enrollment => {
      if (!enrollment.course_id || !enrollment.user_id) return;

      const courseId = String(enrollment.course_id);
      const studentId = String(enrollment.user_id);
      const uniqueKey = `${courseId}_${studentId}`;

      if (!courseMap.has(courseId)) return;

      if (!uniqueEnrollmentMap.has(uniqueKey)) {
        uniqueEnrollmentMap.set(uniqueKey, enrollment);
      }
    });

    const uniqueEnrollments = Array.from(uniqueEnrollmentMap.values());

    // Unique students across all instructor courses
    const enrolledStudentIds = new Set(
      uniqueEnrollments.map(item => String(item.user_id))
    );

    // Current and previous month date ranges
    const now = new Date();

    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const lastMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    let currentMonthEarning = 0;
    let lastMonthEarning = 0;

    // Group enrollments course-wise
    const courseSalesMap = new Map();

    uniqueEnrollments.forEach(enrollment => {
      const courseId = String(enrollment.course_id);
      const course = courseMap.get(courseId);

      if (!course) return;

      const courseFees = Number(course.fees || 0);
      const enrollmentDate = new Date(enrollment.enrollment_Date);

      // Monthly income based on enrollment date
      if (
        enrollmentDate >= currentMonthStart &&
        enrollmentDate < nextMonthStart
      ) {
        currentMonthEarning += courseFees;
      }

      if (
        enrollmentDate >= lastMonthStart &&
        enrollmentDate < currentMonthStart
      ) {
        lastMonthEarning += courseFees;
      }

      if (!courseSalesMap.has(courseId)) {
        courseSalesMap.set(courseId, {
          _id: course._id,
          name: course.name,
          fees: courseFees,
          duration: course.duration,
          course_img: course.course_img || [],
          totalSelling: 0,
          totalAmount: 0
        });
      }

      const courseSale = courseSalesMap.get(courseId);

      courseSale.totalSelling += 1;
      courseSale.totalAmount = courseSale.totalSelling * courseFees;
    });

    // Only courses with at least one enrollment
    const mostSellingCourses = Array.from(courseSalesMap.values())
      .filter(course => course.totalSelling > 0)
      .sort((a, b) => b.totalSelling - a.totalSelling);

    // Rating and review details
    const reviews = await Review.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          rating: { $type: "number" }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const averageRating = reviews.length
      ? Number(reviews[0].averageRating.toFixed(1))
      : null;

    // Percentage comparison with previous month
    let earningPercentage = null;

    if (lastMonthEarning > 0) {
      earningPercentage =
        ((currentMonthEarning - lastMonthEarning) / lastMonthEarning) * 100;
    } else if (currentMonthEarning > 0) {
      earningPercentage = 100;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalStudents: enrolledStudentIds.size,
        enrolledStudents: enrolledStudentIds.size,
        totalEnrollments: uniqueEnrollments.length,
        averageRating,
        totalReviews: reviews[0]?.totalReviews || 0,
        currentMonthEarning,
        lastMonthEarning,
        earningPercentage,
        mostSellingCourses
      }
    });
  } catch (error) {
    console.error("Instructor dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor dashboard statistics",
      error: error.message
    });
  }
};








// const Users = require("../model/user.model");
// const Course = require("../model/coruse.model");
// const Enrollment = require("../model/enrollment.model");



// exports.getDashboardStats = async (req, res) => {
//   try {
//     const [totalActiveUsers, totalCourses, enrollments] =
//       await Promise.all([
//         Users.countDocuments({
//           is_active: true,
//           role: { $nin: ["admin", "Admin"] }
//         }),
//         Course.countDocuments({ is_active: true }),
//         Enrollment.find().select("course")
//       ]);

//     const totalEnrollments = enrollments.reduce(
//       (total, enrollment) =>
//         total + (enrollment.course?.length || 0),
//       0
//     );

//     const enrollmentCourseIds = enrollments.flatMap(
//       enrollment =>
//         (enrollment.course || []).map(item => item.course_id)
//     );

//     const enrolledCourses = await Course.find({
//       _id: { $in: enrollmentCourseIds }
//     }).select("_id fees");

//     const feeMap = new Map(
//       enrolledCourses.map(course => [
//         course._id.toString(),
//         Number(course.fees) || 0
//       ])
//     );

//     const totalRevenue = enrollments.reduce(
//       (total, enrollment) =>
//         total +
//         (enrollment.course || []).reduce(
//           (sum, item) =>
//             sum + (feeMap.get(
//               String(item.course_id || item)
//             ) || 0),
//           0
//         ),
//       0
//     );

//     return res.status(200).json({
//       success: true,
//       data: {
//         totalActiveUsers,
//         totalCourses,
//         totalEnrollments,
//         totalRevenue
//       }
//     });
//   } catch (error) {
//     console.error("Dashboard stats error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch dashboard statistics"
//     });
//   }
// };
