const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendEmail } = require("../utils/emailService");

// @desc    Submit job application
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = async (req, res) => {
    try {
        const { cv, cvFileName, expectedSalary, experience, currentLocation, coverLetter } = req.body;
        const jobId = req.params.id;

        // Get job details
        const job = await Job.findById(jobId).populate("company", "name email");
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if user already applied
        const existingApplication = await JobApplication.findOne({
            job: jobId,
            applicant: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // Create application
        const application = await JobApplication.create({
            job: jobId,
            jobTitle: job.title,
            company: job.company._id,
            companyName: job.companyName,
            applicant: req.user._id,
            applicantName: req.user.name,
            applicantEmail: req.user.email,
            cv,
            cvFileName,
            expectedSalary,
            experience,
            currentLocation,
            coverLetter: coverLetter || "",
        });

        // Update job applicants count
        job.applicants = (job.applicants || 0) + 1;
        await job.save();

        res.status(201).json({
            message: "Application submitted successfully",
            application,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
    try {
        const { status, company } = req.query;
        let query = {};

        if (status) query.status = status;
        if (company) query.company = company;

        const applications = await JobApplication.find(query)
            .populate("job", "title location category")
            .populate("company", "name email imageLink")
            .populate("applicant", "name email imageLink")
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company's applications
// @route   GET /api/applications/company
// @access  Private (Company)
const getCompanyApplications = async (req, res) => {
    try {
        const { status, job } = req.query;
        let query = { company: req.user._id };

        if (status) query.status = status;
        if (job) query.job = job;

        const applications = await JobApplication.find(query)
            .populate("job", "title location category")
            .populate("applicant", "name email imageLink")
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/user
// @access  Private
const getUserApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ applicant: req.user._id })
            .populate("job", "title location category type")
            .populate("company", "name email imageLink")
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company/Admin)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await JobApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check authorization (company owner or admin)
        if (
            req.user.role !== "admin" &&
            application.company.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        application.status = status;
        application.reviewedBy = req.user._id;
        application.reviewedAt = new Date();

        await application.save();

        // Create in-app notification for the applicant
        try {
            let notificationMessage = "";
            if (status === "shortlisted") {
                notificationMessage = `Congratulations! You've been shortlisted for ${application.jobTitle} at ${application.companyName}`;
            } else if (status === "rejected") {
                notificationMessage = `Your application for ${application.jobTitle} at ${application.companyName} has been reviewed`;
            }

            if (notificationMessage) {
                await Notification.create({
                    userId: application.applicant,
                    message: notificationMessage,
                    type: "application",
                    link: `/applications`, // Link to user's applications page
                });
            }
        } catch (notifError) {
            console.error("Error creating notification:", notifError.message);
            // Don't fail the request if notification creation fails
        }

        res.json({
            message: "Application status updated",
            application,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send notification email to applicant
// @route   POST /api/applications/:id/notify
// @access  Private (Admin)
const notifyApplicant = async (req, res) => {
    try {
        const application = await JobApplication.findById(req.params.id)
            .populate("job", "title")
            .populate("company", "name")
            .populate("applicant", "_id name email");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Prepare email content and notification message
        let subject, message, notificationMessage;
        if (application.status === "shortlisted") {
            subject = `Good News! You've been shortlisted for ${application.jobTitle}`;
            message = `
                <h2>Congratulations!</h2>
                <p>Dear ${application.applicantName},</p>
                <p>We are pleased to inform you that you have been shortlisted for the position of <strong>${application.jobTitle}</strong> at <strong>${application.companyName}</strong>.</p>
                <p>The company will contact you soon for the next steps.</p>
                <p>Best regards,<br>JobGate Team</p>
            `;
            notificationMessage = `Congratulations! You've been shortlisted for ${application.jobTitle} at ${application.companyName}. Check your email for more details.`;
        } else if (application.status === "rejected") {
            subject = `Update on your application for ${application.jobTitle}`;
            message = `
                <h2>Application Update</h2>
                <p>Dear ${application.applicantName},</p>
                <p>Thank you for your interest in the position of <strong>${application.jobTitle}</strong> at <strong>${application.companyName}</strong>.</p>
                <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
                <p>We encourage you to apply for other positions that match your skills and experience.</p>
                <p>Best regards,<br>JobGate Team</p>
            `;
            notificationMessage = `Your application for ${application.jobTitle} at ${application.companyName} has been reviewed. Check your email for details.`;
        } else {
            return res.status(400).json({ message: "Cannot notify for pending applications" });
        }

        // Send email
        const emailResult = await sendEmail(application.applicantEmail, subject, message);

        // Create in-app notification
        try {
            await Notification.create({
                userId: application.applicant._id,
                message: notificationMessage,
                type: "job_application",
                applicationId: application._id,
            });
            console.log("In-app notification created for user:", application.applicant._id);
        } catch (notifError) {
            console.error("Error creating in-app notification:", notifError.message);
            // Don't fail the request if notification creation fails
        }

        // Mark as notified
        application.notified = true;
        await application.save();

        if (emailResult) {
            res.json({ message: "Notification sent successfully via email and in-app" });
        } else {
            res.json({ message: "In-app notification sent. Email delivery may have failed - please check email configuration." });
        }
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getAllApplications,
    getCompanyApplications,
    getUserApplications,
    updateApplicationStatus,
    notifyApplicant,
};
