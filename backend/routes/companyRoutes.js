const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getDashboardStats,
    getTopPerformingJobs,
    getRecentApplications,
} = require("../controllers/companyController");

// All routes require authentication
router.use(protect);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/top-jobs", getTopPerformingJobs);
router.get("/dashboard/recent-applications", getRecentApplications);

module.exports = router;
