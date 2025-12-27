const nodemailer = require("nodemailer");

// Create transporter
// NOTE: You need to generate an App Password for Gmail:
// 1. Go to Google Account settings
// 2. Security > 2-Step Verification (enable if not enabled)
// 3. App passwords > Generate new app password
// 4. Add the password to your .env file as EMAIL_PASSWORD
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER || "abdelrhmanelanani202@gmail.com",
            pass: process.env.EMAIL_PASSWORD || "", // Add your app password in .env
        },
    });
};

// Send email function
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `JobGate <${process.env.EMAIL_USER || "abdelrhmanelanani202@gmail.com"}>`,
            to,
            subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        // Don't throw error - just log it so application continues
        // In production, you might want to queue failed emails for retry
        return null;
    }
};

module.exports = { sendEmail };
