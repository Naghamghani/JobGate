const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");

// @desc    Get company dashboard statistics
// @route   GET /api/companies/dashboard/stats
// @access  Private (Company)
const getDashboardStats = async (req, res) => {
    try {
        const companyId = req.user._id;

        // Get all jobs for this company
        const allJobs = await Job.find({ company: companyId });
        const activeJobs = allJobs.filter(job => job.status === 'active');

        // Get all applications for this company's jobs
        const allApplications = await JobApplication.find({ company: companyId });

        // Calculate statistics
        const stats = {
            totalJobs: allJobs.length,
            activeJobs: activeJobs.length,
            totalApplications: allApplications.length,
            totalViews: allJobs.reduce((sum, job) => sum + (job.views || 0), 0),
            pendingApplications: allApplications.filter(app => app.status === 'pending').length,
            shortlistedApplications: allApplications.filter(app => app.status === 'shortlisted').length,
            rejectedApplications: allApplications.filter(app => app.status === 'rejected').length,
        };

        res.json({ stats });
    } catch (error) {
        console.error("Error getting dashboard stats:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get top performing jobs
// @route   GET /api/companies/dashboard/top-jobs
// @access  Private (Company)
const getTopPerformingJobs = async (req, res) => {
    try {
        const companyId = req.user._id;

        // Get all jobs for this company
        const jobs = await Job.find({ company: companyId, status: 'active' })
            .select('title applicants views location type createdAt')
            .lean();

        // Sort by applicants (top 5)
        const topByApplicants = [...jobs]
            .sort((a, b) => (b.applicants || 0) - (a.applicants || 0))
            .slice(0, 5);

        // Sort by views (top 5)
        const topByViews = [...jobs]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);

        res.json({
            topByApplicants,
            topByViews,
        });
    } catch (error) {
        console.error("Error getting top jobs:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recent applications
// @route   GET /api/companies/dashboard/recent-applications
// @access  Private (Company)
const getRecentApplications = async (req, res) => {
    try {
        const companyId = req.user._id;
        const limit = parseInt(req.query.limit) || 10;

        const applications = await JobApplication.find({ company: companyId })
            .populate('applicant', 'name email imageLink')
            .select('applicantName jobTitle status createdAt')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({ applications });
    } catch (error) {
        console.error("Error getting recent applications:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getTopPerformingJobs,
    getRecentApplications,
};
