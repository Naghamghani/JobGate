const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Special handling for admin
            if (decoded.id === "admin-id") {
                req.user = {
                    _id: "admin-id",
                    email: "jobgate@gmail.com",
                    name: "JobGate Admin",
                    role: "admin",
                };
                return next();
            }

            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401).json({ message: "Not authorized as admin" });
    }
};

const adminOrCompany = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "company")) {
        next();
    } else {
        res.status(401).json({ message: "Not authorized. Only admin or company can perform this action." });
    }
};

module.exports = { protect, admin, adminOrCompany };
