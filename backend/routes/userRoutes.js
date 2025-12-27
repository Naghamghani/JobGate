const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/featured-companies", getFeaturedCompanies);
router.get("/all-companies", getAllCompanies); // Public route for all companies

// Public company profile route (must be before /:id to avoid conflicts)
router.get("/company/:id", async (req, res) => {
    try {
        const User = require("../models/User");
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
});

// Protected routes
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

// Admin routes - Get all users
router.get("/", protect, admin, getAllUsers);

// Admin routes - Create company
router.post("/admin/create-company", protect, admin, adminCreateCompany);

// Admin routes - Company management
router.get("/companies", protect, admin, getAllCompanies);
router.get("/companies/:id", protect, admin, getCompanyById);

// Admin routes - User management by ID
router.route("/:id")
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
