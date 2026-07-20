const mongoose = require("mongoose");

const blockedWordSchema = new mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        category: {
            type: String,
            default: "Profanity",
            trim: true,
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("BlockedWord", blockedWordSchema);