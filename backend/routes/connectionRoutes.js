const express = require("express");
const router = express.Router();
const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getMyConnections,
    getPendingRequests,
    getSuggestedUsers,
    removeConnection,
} = require("../controllers/connectionController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.post("/request", protect, sendConnectionRequest);
router.put("/:id/accept", protect, acceptConnectionRequest);
router.put("/:id/reject", protect, rejectConnectionRequest);
router.get("/my-connections", protect, getMyConnections);
router.get("/pending", protect, getPendingRequests);
router.get("/suggestions", protect, getSuggestedUsers);
router.delete("/:id", protect, removeConnection);

module.exports = router;
