const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const Job = require("./models/Job");
const Category = require("./models/Category");

const recalculateCategoryCounts = async () => {
    try {
        await connectDB();

        console.log("Starting category job count recalculation...");

        // Get all categories
        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories`);

        // Reset all category job counts to 0
        await Category.updateMany({}, { jobCount: 0 });
        console.log("Reset all category job counts to 0");

        // Get all jobs
        const jobs = await Job.find({});
        console.log(`Found ${jobs.length} jobs`);

        // Count jobs per category
        const categoryCounts = {};
        jobs.forEach((job) => {
            const categoryName = job.category.toLowerCase();
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        });

        console.log("\nJob counts per category:");
        console.log(categoryCounts);

        // Update each category with the correct count
        for (const [categoryName, count] of Object.entries(categoryCounts)) {
            const result = await Category.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${categoryName}$`, "i") } },
                { jobCount: count },
                { new: true }
            );

            if (result) {
                console.log(`✓ Updated "${result.name}" category: ${count} jobs`);
            } else {
                console.log(`✗ Category "${categoryName}" not found in database`);
            }
        }

        console.log("\n✅ Category job counts recalculated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error recalculating category counts:", error);
        process.exit(1);
    }
};

recalculateCategoryCounts();
