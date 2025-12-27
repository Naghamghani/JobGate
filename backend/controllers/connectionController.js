const Connection = require("../models/Connection");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// @desc    Send connection request
// @route   POST /api/connections/request
// @access  Private
const sendConnectionRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;

        // Check if receiver exists and is a candidate
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        if (receiver.role !== "candidate") {
            return res.status(400).json({ message: "Can only connect with candidates" });
        }

        // Check if trying to connect with self
        if (senderId.toString() === receiverId) {
            return res.status(400).json({ message: "Cannot connect with yourself" });
        }

        // Check if connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });

        if (existingConnection) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        // Create connection request
        const connection = await Connection.create({
            sender: senderId,
            receiver: receiverId,
            status: "pending",
        });

        // Create notification for receiver
        const sender = await User.findById(senderId);
        await createNotification(
            "connection_request",
            `${sender.name} sent you a connection request`,
            receiverId,
            null,
            connection._id
        );

        res.status(201).json({
            message: "Connection request sent",
            connection,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Accept connection request
// @route   PUT /api/connections/:id/accept
// @access  Private
const acceptConnectionRequest = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.id);

        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        // Verify user is the receiver
        if (connection.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ message: "Connection request already processed" });
        }

        connection.status = "accepted";
        await connection.save();

        // Create notification for sender
        const receiver = await User.findById(connection.receiver);
        await createNotification(
            "connection_accepted",
            `${receiver.name} accepted your connection request`,
            connection.sender,
            null,
            connection._id
        );

        res.json({
            message: "Connection request accepted",
            connection,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Reject connection request
// @route   PUT /api/connections/:id/reject
// @access  Private
const rejectConnectionRequest = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.id);

        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        // Verify user is the receiver
        if (connection.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ message: "Connection request already processed" });
        }

        connection.status = "rejected";
        await connection.save();

        res.json({
            message: "Connection request rejected",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get my connections (accepted only)
// @route   GET /api/connections/my-connections
// @access  Private
const getMyConnections = async (req, res) => {
    try {
        const userId = req.user._id;

        const connections = await Connection.find({
            $or: [{ sender: userId }, { receiver: userId }],
            status: "accepted",
        })
            .populate("sender", "name email imageLink headline")
            .populate("receiver", "name email imageLink headline")
            .sort({ createdAt: -1 });

        // Format connections to return the other user
        const formattedConnections = connections.map((conn) => {
            const friend = conn.sender._id.toString() === userId.toString() ? conn.receiver : conn.sender;
            return {
                _id: conn._id,
                friend,
                connectedAt: conn.updatedAt,
            };
        });

        res.json(formattedConnections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get pending requests
// @route   GET /api/connections/pending
// @access  Private
const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const pendingRequests = await Connection.find({
            receiver: userId,
            status: "pending",
        })
            .populate("sender", "name email imageLink headline")
            .sort({ createdAt: -1 });

        res.json(pendingRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get suggested users to connect with
// @route   GET /api/connections/suggestions
// @access  Private
const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all existing connections (any status)
        const existingConnections = await Connection.find({
            $or: [{ sender: userId }, { receiver: userId }],
        });

        const connectedUserIds = existingConnections.map((conn) =>
            conn.sender.toString() === userId.toString() ? conn.receiver : conn.sender
        );

        // Get users who are not connected and are candidates
        const suggestedUsers = await User.find({
            _id: { $nin: [...connectedUserIds, userId] },
            role: "candidate",
        })
            .select("name email imageLink headline")
            .limit(20);

        res.json(suggestedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Remove connection
// @route   DELETE /api/connections/:id
// @access  Private
const removeConnection = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.id);

        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        // Verify user is part of the connection
        const userId = req.user._id.toString();
        if (
            connection.sender.toString() !== userId &&
            connection.receiver.toString() !== userId
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await connection.deleteOne();

        res.json({ message: "Connection removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getMyConnections,
    getPendingRequests,
    getSuggestedUsers,
    removeConnection,
};
