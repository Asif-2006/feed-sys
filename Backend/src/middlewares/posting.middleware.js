// posting.middleware.js

const UserModel = require("../models/user.model");

async function canCreatePost(req, res, next) {
    try {
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.postingStatus === "suspended") {

            if (
                user.postingSuspensionExpiresAt &&
                new Date() >= user.postingSuspensionExpiresAt
            ) {
                user.postingStatus = "active";
                user.postingSuspensionExpiresAt = null;
                user.postingSuspensionReason = "";

                await user.save();
            } else {
                return res.status(403).json({
                    message: "You are temporarily suspended from posting.",
                    reason: user.postingSuspensionReason,
                    expiresAt: user.postingSuspensionExpiresAt
                });
            }
        }

        req.userData = user;   // optional
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    canCreatePost
};