const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
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
        type: {
            type: String,
            required: true,
            enum: ["remote", "onsite", "freelance", "hybrid"],
            default: "onsite",
        },
        location: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: {
            type: String,
            default: "",
        },
        skills: {
            type: [String],
            default: [],
        },
        salary: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 0,
            },
            currency: {
                type: String,
                default: "USD",
            },
        },
        experience: {
            type: String,
            enum: ["entry", "mid", "senior", "lead", "any"],
            default: "any",
        },
        status: {
            type: String,
            enum: ["active", "closed", "draft", "pending"],
            default: "active",
        },
        applicants: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        deadline: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", jobSchema);
