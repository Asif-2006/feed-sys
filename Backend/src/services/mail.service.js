require('dotenv').config();
const nodemailer = require('nodemailer');

const welcomeTemplate = require("../templates/welcome.template");
const violationTemplate = require("../templates/violation.template");
const blockTemplate = require("../templates/block.template");
const unblockTemplate = require("../templates/unblock.template");



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error) => {
    if (error) {
        console.error("Email server connection failed:", error);
    } else {
        console.log("Email server is ready.");
    }
});

async function sendWelcomeEmail(user) {
    try {
        console.log("Sending welcome email to:", user.email);

        const info = await transporter.sendMail({
            from: `"FeedSys Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Welcome!",
            html: welcomeTemplate(user.username)
        });

        console.log("Email sent:", info.messageId);
    } catch (err) {
        console.error("Failed to send welcome email:");
        console.error(err);
        throw err;
    }
}

async function sendViolationEmail(user, violations) {


    try {
        await transporter.sendMail({
            from: `"HexiNova Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "⚠ HexiNova Community Guidelines Violation",
            html: violationTemplate(user.username, violations)
        });
    } catch (err) {
        console.error("Failed to send welcome email:", err.message);
        throw err;
    }
}


async function sendBlockEmail(user, reason) {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your HexiNova Account Has Been Blocked",
        html: blockTemplate(user.username, reason)
    });

}


async function sendUnblockEmail(user) {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your HexiNova Account Has Been Restored",
        html: unblockTemplate(user.username)
    });

}

module.exports = {
    sendWelcomeEmail,
    sendViolationEmail,
    sendBlockEmail,
    sendUnblockEmail
};