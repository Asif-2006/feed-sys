const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        fullName: {
            type: String,
            trim: true,
            default: ""
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        bio: {
            type: String,
            default: "",
            maxlength: 200,
        },

        profilePicture: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        // ---------- Account ----------

        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active",
        },

        blockedReason: {
            type: String,
            default: "",
        },

        // ---------- Posting ----------

        postingStatus: {
            type: String,
            enum: ["active", "suspended"],
            default: "active",
        },

        postingSuspensionReason: {
            type: String,
            default: "",
        },

        postingSuspensionExpiresAt: {
            type: Date,
            default: null,
        },

        strikeCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;