const express = require("express");
const router = express.Router();
const {
    applyForJob,
    getAllApplications,
    getCompanyApplications,
    getUserApplications,
    updateApplicationStatus,
    notifyApplicant,
} = require("../controllers/applicationController");
const { protect, admin, adminOrCompany } = require("../middleware/authMiddleware");

// Apply for job
router.post("/jobs/:id/apply", protect, applyForJob);

// Get applications
router.get("/applications", protect, admin, getAllApplications);
router.get("/applications/company", protect, getCompanyApplications);
router.get("/applications/user", protect, getUserApplications);

// Update application status
router.put("/applications/:id/status", protect, updateApplicationStatus);

// Send notification (admin or company)
router.post("/applications/:id/notify", protect, adminOrCompany, notifyApplicant);

module.exports = router;

