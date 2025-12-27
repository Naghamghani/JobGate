const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// @desc    Get recent notifications (last 24 hours)
// @route   GET /api/notifications
// @access  Private
const getRecentNotifications = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Validate that req.user._id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Get notifications for the current user
        const notifications = await Notification.find({
            userId: req.user._id,
            createdAt: { $gte: twentyFourHoursAgo },
        })
            .populate("userId", "name email role")
            .populate("connectionId")
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            createdAt: { $gte: twentyFourHoursAgo },
            read: false,
        });

        res.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Error in getRecentNotifications:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.read = true;
        await notification.save();

        res.json({ message: "Notification marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ read: false }, { read: true });
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Create notification (helper function)
const createNotification = async (type, message, userId, applicationId = null, connectionId = null) => {
    try {
        const notification = await Notification.create({
            type,
            message,
            userId,
            applicationId,
            connectionId,
        });
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};

// @desc    Cleanup old notifications (older than 24 hours)
const cleanupOldNotifications = async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await Notification.deleteMany({
            createdAt: { $lt: twentyFourHoursAgo },
        });
        console.log(`Cleaned up ${result.deletedCount} old notifications`);
        return result.deletedCount;
    } catch (error) {
        console.error("Error cleaning up notifications:", error.message);
        return 0;
    }
};

// @desc    Cleanup invalid notifications (with invalid ObjectIds)
const cleanupInvalidNotifications = async () => {
    try {
        // Find all notifications
        const allNotifications = await Notification.find({}).lean();
        let deletedCount = 0;

        for (const notif of allNotifications) {
            // Check if userId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(notif.userId)) {
                await Notification.deleteOne({ _id: notif._id });
                deletedCount++;
                console.log(`Deleted invalid notification with userId: ${notif.userId}`);
            }
        }

        console.log(`Cleaned up ${deletedCount} invalid notifications`);
        return deletedCount;
    } catch (error) {
        console.error("Error cleaning up invalid notifications:", error.message);
        return 0;
    }
};

module.exports = {
    getRecentNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    cleanupOldNotifications,
    cleanupInvalidNotifications,
};
