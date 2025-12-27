const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        jobTitle: {
            type: String,
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        applicantName: {
            type: String,
            required: true,
        },
        applicantEmail: {
            type: String,
            required: true,
        },
        cv: {
            type: String, // Base64 encoded file
            required: true,
        },
        cvFileName: {
            type: String,
            default: "",
        },
        expectedSalary: {
            type: Number,
            required: true,
        },
        experience: {
            type: String,
            required: true,
            enum: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
        },
        currentLocation: {
            type: String,
            required: true,
        },
        coverLetter: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "shortlisted", "rejected"],
            default: "pending",
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: {
            type: Date,
        },
        notified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
