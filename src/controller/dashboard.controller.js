
const Users = require("../model/user.model");
const Course = require("../model/coruse.model");
const Enrollment = require("../model/enrollment.model");
const Review = require("../model/review.model");

// ADMIN DASHBOARD - All platform statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const successfulStatuses = ["success", "paid", "completed"];

    const [
      totalActiveUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalActiveCourses,
      totalEnrollments
    ] = await Promise.all([
      Users.countDocuments({
        is_active: true,
        role: { $nin: ["admin", "Admin"] }
      }),

      Users.countDocuments({
        is_active: true,
        role: { $in: ["user", "User", "student", "Student"] }
      }),

      Users.countDocuments({
        is_active: true,
        role: { $in: ["Instructor", "instructor", "teacher", "Teacher"] }
      }),

      Course.countDocuments(),

      Course.countDocuments({
        is_active: true
      }),

      Enrollment.countDocuments({
        payment_status: { $in: successfulStatuses }
      })
    ]);

    // Total platform revenue
    const revenueResult = await Enrollment.aggregate([
      {
        $match: {
          payment_status: { $in: successfulStatuses }
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
      {
        $unwind: "$course"
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$course.fees"
          }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Popular courses - unique students per course
    const popularCourses = await Enrollment.aggregate([
      {
        $match: {
          payment_status: { $in: successfulStatuses }
        }
      },
      {
        $group: {
          _id: {
            course_id: "$course_id",
            user_id: "$user_id"
          }
        }
      },
      {
        $group: {
          _id: "$_id.course_id",
          totalStudents: { $sum: 1 }
        }
      },
      {
        $sort: {
          totalStudents: -1
        }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "coruses",
          localField: "_id",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $unwind: "$course"
      },
      {
        $lookup: {
          from: "categories",
          localField: "course.categories_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: "$course._id",
          name: "$course.name",
          category: {
            $ifNull: ["$category.name", "Uncategorized"]
          },
          students: "$totalStudents",
          rank: {
            $cond: [
              { $gte: ["$totalStudents", 10] },
              "Popular",
              "Active"
            ]
          },
          rankColor: {
            $cond: [
              { $gte: ["$totalStudents", 10] },
              "primary",
              "success"
            ]
          }
        }
      }
    ]);

    // Recent successful enrollments
    const recentEnrollments = await Enrollment.find({
      payment_status: { $in: successfulStatuses }
    })
      .sort({ enrollment_Date: -1, _id: -1 })
      .limit(5)
      .populate({
        path: "course_id",
        select: "name categories_id fees",
        populate: {
          path: "categories_id",
          select: "name"
        }
      })
      .populate("user_id", "name email")
      .lean();

    const formattedEnrollments = recentEnrollments.map(item => ({
      _id: item._id,
      name: item.course_id?.name || "Course not found",
      category: item.course_id?.categories_id?.name || "Uncategorized",
      studentName: item.user_id?.name || "Student",
      studentEmail: item.user_id?.email || "",
      enrollmentDate: item.enrollment_Date,
      amount: item.course_id?.fees || 0,
      status: "Enrolled",
      paymentStatus: item.payment_status,
      statusColor: "success"
    }));

    return res.status(200).json({
      success: true,
      message: "Admin dashboard statistics fetched successfully",
      data: {
        totalActiveUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalActiveCourses,
        totalEnrollments,
        totalRevenue,
        popularCourses,
        recentEnrollments: formattedEnrollments
      }
    });

  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    console.error("Full error stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};


// INSTRUCTOR DASHBOARD - Only logged-in instructor's data
exports.getInstructorDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user._id;

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

    const enrollments = await Enrollment.find({
      course_id: { $in: courseIds }
    })
      .select("course_id user_id enrollment_Date")
      .sort({ enrollment_Date: 1, _id: 1 })
      .lean();

    const courseMap = new Map(
      courses.map(course => [String(course._id), course])
    );

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

    const enrolledStudentIds = new Set(
      uniqueEnrollments.map(item => String(item.user_id))
    );

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

    const courseSalesMap = new Map();

    uniqueEnrollments.forEach(enrollment => {
      const courseId = String(enrollment.course_id);
      const course = courseMap.get(courseId);

      if (!course) return;

      const courseFees = Number(course.fees || 0);
      const enrollmentDate = new Date(enrollment.enrollment_Date);

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

    const mostSellingCourses = Array.from(courseSalesMap.values())
      .filter(course => course.totalSelling > 0)
      .sort((a, b) => b.totalSelling - a.totalSelling);

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
