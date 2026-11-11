
const express = require("express");
const router = express.Router();

const dashboardController = require("../../../controller/dashboard.controller");
const auth = require("../../../middleware/auth");

// Admin dashboard
router.get(
  "/stats",
  auth(["admin", "Admin"]),
  dashboardController.getDashboardStats
);

// Instructor dashboard
router.get(
  "/instructor-stats",
  auth(["Instructor", "instructor"]),
  dashboardController.getInstructorDashboardStats
);

module.exports = router;





// const express = require("express");
// const router = express.Router();
// const dashboardController = require("../../../controller/dashboard.controller");

// router.get("/stats", dashboardController.getDashboardStats);

// module.exports = router;

