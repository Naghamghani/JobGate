const mongoose = require("mongoose");

const connectionSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
connectionSchema.index({ status: 1 });

// Prevent duplicate connection requests (unique compound index)
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model("Connection", connectionSchema);
