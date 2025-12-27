const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { createNotification } = require("./notificationController");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { userID, name, email, password, role, cvFileName, location, category, about, imageLink } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Role-specific validation
        if (role === "candidate" && !cvFileName) {
            return res.status(400).json({ message: "CV is required for candidates" });
        }

        if (role === "company" && (!location || !category || !about)) {
            return res.status(400).json({ message: "Location, category, and about are required for companies" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            userID,
            name,
            email,
            password: hashedPassword,
            role: role || "candidate",
            imageLink: imageLink || undefined,
            cvFileName: role === "candidate" ? cvFileName : undefined,
            location: role === "company" ? location : undefined,
            category: role === "company" ? category : undefined,
            about: role === "company" ? about : undefined,
        });

        if (user) {
            // Create notification for admin
            const roleLabel = role === "company" ? "Company" : "Candidate";
            await createNotification(
                "new_user",
                `New ${roleLabel} registered: ${name}`,
                user._id
            );

            res.status(201).json({
                _id: user._id,
                userID: user.userID,
                name: user.name,
                email: user.email,
                role: user.role,
                imageLink: user.imageLink,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for admin credentials
        if (email === "jobgate@gmail.com" && password === "jobgate123") {
            // Return admin user
            return res.json({
                _id: "admin-id",
                userID: "admin-unique-id",
                name: "JobGate Admin",
                email: "jobgate@gmail.com",
                role: "admin",
                imageLink: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
                token: generateToken("admin-id"),
            });
        }

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                userID: user.userID,
                name: user.name,
                email: user.email,
                role: user.role,
                imageLink: user.imageLink,
                cvFileName: user.cvFileName,
                location: user.location,
                category: user.category,
                about: user.about,
                website: user.website,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // Validate that the user ID is a valid ObjectId
        if (!req.user || !req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(req.user._id).select("-password");

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Prevent userID from being changed
            if (req.body.userID && req.body.userID !== user.userID) {
                return res.status(400).json({ message: "User ID cannot be changed" });
            }

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.imageLink = req.body.imageLink || user.imageLink;
            user.headline = req.body.headline !== undefined ? req.body.headline : user.headline;

            // Update role-specific fields
            if (user.role === "candidate") {
                user.cvFileName = req.body.cvFileName || user.cvFileName;
            } else if (user.role === "company") {
                if (req.body.location !== undefined) user.location = req.body.location;
                if (req.body.category !== undefined) user.category = req.body.category;
                if (req.body.about !== undefined) user.about = req.body.about;
                if (req.body.website !== undefined) user.website = req.body.website;
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                userID: updatedUser.userID,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                imageLink: updatedUser.imageLink,
                headline: updatedUser.headline,
                cvFileName: updatedUser.cvFileName,
                location: updatedUser.location,
                category: updatedUser.category,
                about: updatedUser.about,
                website: updatedUser.website,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update user by ID (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.imageLink = req.body.imageLink || user.imageLink;
            user.headline = req.body.headline || user.headline;

            // Update role-specific fields
            if (req.body.cvFileName) user.cvFileName = req.body.cvFileName;
            if (req.body.location) user.location = req.body.location;
            if (req.body.category) user.category = req.body.category;
            if (req.body.about) user.about = req.body.about;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                userID: updatedUser.userID,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                imageLink: updatedUser.imageLink,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: "User removed successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all companies (admin only)
// @route   GET /api/users/companies
// @access  Private/Admin
const getAllCompanies = async (req, res) => {
    try {
        const companies = await User.find({ role: "company" }).select("-password");
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get company by ID (admin only)
// @route   GET /api/users/companies/:id
// @access  Private/Admin
const getCompanyById = async (req, res) => {
    try {
        const company = await User.findOne({ _id: req.params.id, role: "company" }).select("-password");

        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ message: "Company not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get featured companies (random)
// @route   GET /api/users/featured-companies
// @access  Public
const getFeaturedCompanies = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;

        // Get random companies
        const companies = await User.aggregate([
            { $match: { role: "company" } },
            { $sample: { size: limit } },
            { $project: { password: 0 } }
        ]);

        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Admin create company
// @route   POST /api/users/admin/create-company
// @access  Private (Admin only)
const adminCreateCompany = async (req, res) => {
    try {
        const { name, email, password, location, category, about, imageLink } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email, and password" });
        }

        if (!location || !category || !about) {
            return res.status(400).json({ message: "Location, category, and about are required for companies" });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate unique userID
        const userID = `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create company
        const company = await User.create({
            userID,
            name,
            email,
            password: hashedPassword,
            role: "company",
            location,
            category,
            about,
            imageLink: imageLink || undefined,
        });

        if (company) {
            res.status(201).json({
                _id: company._id,
                name: company.name,
                email: company.email,
                role: company.role,
                location: company.location,
                category: company.category,
                about: company.about,
                message: "Company created successfully",
            });
        } else {
            res.status(400).json({ message: "Failed to create company" });
        }
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllCompanies,
    getCompanyById,
    getFeaturedCompanies,
    adminCreateCompany,
};
