const express = require("express");
const router = express.Router();
const {
    getRecentNotifications,
    markAsRead,
    markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication (not admin-only)
router.get("/", protect, getRecentNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

module.exports = router;
