const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["candidate", "company", "admin"],
            default: "candidate",
        },
        imageLink: {
            type: String,
            default: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
        },
        headline: {
            type: String,
            default: "",
        },
        // Candidate-specific fields
        cvFileName: {
            type: String,
            default: "",
        },
        cv: {
            type: String,
            default: "",
        },
        // Company-specific fields
        location: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            default: "",
        },
        about: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);

