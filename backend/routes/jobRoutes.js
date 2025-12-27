const express = require("express");
const router = express.Router();
const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getJobsByCompany,
    getMyJobs,
    getJobFilters,
} = require("../controllers/jobController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllJobs);
router.get("/filters", getJobFilters);
router.get("/company/:companyId", getJobsByCompany);
router.get("/:id", getJobById);

// Protected routes (Company only)
router.post("/", protect, createJob);
router.get("/my/jobs", protect, getMyJobs);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
