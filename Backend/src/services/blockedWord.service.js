const BlockedWord = require("../models/blockedWord.model");

async function checkBlockedWords(text) {

    if (!text || !text.trim()) {
        return {
            safe: true,
            violations: []
        };
    }

    const blockedWords = await BlockedWord.find({
        isActive: true
    });

    const caption = text.toLowerCase();
    const violations = [];

    for (const blockedWord of blockedWords) {

        // Escape regex special characters
        const escapedWord = blockedWord.word.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(`\\b${escapedWord}\\b`, "i");

        if (regex.test(caption)) {
            violations.push({
                word: blockedWord.word,
                category: blockedWord.category,
                severity: blockedWord.severity
            });
        }
    }

    return {
        safe: violations.length === 0,
        violations
    };
}

module.exports = {
    checkBlockedWords
};