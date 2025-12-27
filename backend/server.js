const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const jobRoutes = require("./routes/jobRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const companyRoutes = require("./routes/companyRoutes");
const { cleanupOldNotifications, cleanupInvalidNotifications } = require("./controllers/notificationController");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

// Routes
app.get("/", (req, res) => {
    res.json({ message: "JobGate API is running..." });
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api", applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Wait for MongoDB to be fully connected before running cleanup
    const mongoose = require('mongoose');

    mongoose.connection.once('open', async () => {
        console.log('MongoDB connection established, running cleanup...');

        // Clean up invalid notifications on server start
        try {
            await cleanupInvalidNotifications();
        } catch (error) {
            console.error("Error during startup cleanup:", error.message);
        }
    });

    // Schedule cleanup of old notifications every hour
    setInterval(async () => {
        if (mongoose.connection.readyState === 1) { // Only if connected
            try {
                await cleanupOldNotifications();
            } catch (error) {
                console.error("Error during scheduled cleanup:", error.message);
            }
        }
    }, 60 * 60 * 1000); // Run every hour
});
