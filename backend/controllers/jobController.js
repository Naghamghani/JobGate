const Job = require("../models/Job");
const User = require("../models/User");

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        const { status, type, category, location, company, search, page = 1, limit = 10 } = req.query;
        let query = {};

        // Filter by status (default to active)
        query.status = status || 'active';

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Filter by company
        if (company) {
            query.company = company;
        }

        // Search by title or company name
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
            ];
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const jobs = await Job.find(query)
            .populate("company", "name email imageLink")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalJobs: total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            "company",
            "name email imageLink location category about"
        );

        if (job) {
            // Increment view count
            job.views += 1;
            await job.save();

            res.json(job);
        } else {
            res.status(404).json({ message: "Job not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Company only)
const createJob = async (req, res) => {
    try {
        const {
            title,
            type,
            location,
            category,
            description,
            requirements,
            skills,
            salary,
            experience,
            status,
            deadline,
        } = req.body;

        // Verify user is a company
        if (req.user.role !== "company") {
            return res.status(403).json({ message: "Only companies can post jobs" });
        }

        const job = await Job.create({
            title,
            company: req.user._id,
            companyName: req.user.name,
            type,
            location,
            category,
            description,
            requirements,
            skills: Array.isArray(skills) ? skills : [],
            salary,
            experience,
            status: status || "active",
            deadline,
        });

        if (job) {
            // Increment category job count
            const Category = require("../models/Category");
            await Category.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${category}$`, 'i') } },
                { $inc: { jobCount: 1 } }
            );

            res.status(201).json(job);
        } else {
            res.status(400).json({ message: "Invalid job data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Company owner or Admin)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if user is the job owner or admin
        if (
            job.company.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this job" });
        }

        // Update fields
        job.title = req.body.title || job.title;
        job.type = req.body.type || job.type;
        job.location = req.body.location || job.location;
        job.category = req.body.category || job.category;
        job.description = req.body.description || job.description;
        job.requirements = req.body.requirements || job.requirements;
        job.skills = req.body.skills || job.skills;
        job.salary = req.body.salary || job.salary;
        job.experience = req.body.experience || job.experience;
        job.status = req.body.status || job.status;
        job.deadline = req.body.deadline || job.deadline;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Company owner or Admin)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if user is the job owner or admin
        if (
            job.company.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this job" });
        }

        // Decrement category job count
        const Category = require("../models/Category");
        await Category.findOneAndUpdate(
            { name: { $regex: new RegExp(`^${job.category}$`, 'i') } },
            { $inc: { jobCount: -1 } }
        );

        await job.deleteOne();
        res.json({ message: "Job removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get jobs by company
// @route   GET /api/jobs/company/:companyId
// @access  Public
const getJobsByCompany = async (req, res) => {
    try {
        const jobs = await Job.find({ company: req.params.companyId }).sort({
            createdAt: -1,
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my jobs (for logged in company)
// @route   GET /api/jobs/my-jobs
// @access  Private (Company only)
const getMyJobs = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ message: "Only companies can access this" });
        }

        const jobs = await Job.find({ company: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job filter options
// @route   GET /api/jobs/filters
// @access  Public
const getJobFilters = async (req, res) => {
    try {
        // Get unique locations
        const locations = await Job.distinct("location", { status: "active" });

        // Get unique categories
        const categories = await Job.distinct("category", { status: "active" });

        // Get companies that have active jobs
        const companies = await Job.find({ status: "active" })
            .distinct("company")
            .then(async (companyIds) => {
                const companyDetails = await User.find({
                    _id: { $in: companyIds },
                    role: "company"
                }).select("_id name imageLink");
                return companyDetails;
            });

        res.json({
            locations: locations.filter(loc => loc), // Remove empty values
            categories: categories.filter(cat => cat),
            companies,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getJobsByCompany,
    getMyJobs,
    getJobFilters,
};
