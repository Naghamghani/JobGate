const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["new_user", "job_application", "connection_request", "connection_accepted", "connection_rejected"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
        },
        connectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Connection",
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
notificationSchema.index({ createdAt: 1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
