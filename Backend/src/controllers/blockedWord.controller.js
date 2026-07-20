const BlockedWord = require("../models/blockedWord.model");

async function addBlockedWord(req, res) {
    try {

        const { word, category, severity } = req.body;

        if (!word) {
            return res.status(400).json({
                message: "Word is required."
            });
        }

        const exists = await BlockedWord.findOne({
            word: word.toLowerCase()
        });

        if (exists) {
            return res.status(409).json({
                message: "Word already exists."
            });
        }

        const blockedWord = await BlockedWord.create({
            word,
            category,
            severity
        });

        return res.status(201).json({
            message: "Blocked word added successfully.",
            blockedWord
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
}

async function getBlockedWords(req, res) {

    try {

        const blockedWords = await BlockedWord.find();

        return res.status(200).json(blockedWords);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function updateBlockedWord(req, res) {

    try {

        const { id } = req.params;

        const blockedWord = await BlockedWord.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!blockedWord) {
            return res.status(404).json({
                message: "Blocked word not found."
            });
        }

        return res.status(200).json({
            message: "Blocked word updated successfully.",
            blockedWord
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function deleteBlockedWord(req, res) {

    try {

        const { id } = req.params;

        const blockedWord = await BlockedWord.findByIdAndDelete(id);

        if (!blockedWord) {

            return res.status(404).json({
                message: "Blocked word not found."
            });

        }

        return res.status(200).json({
            message: "Blocked word deleted successfully."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

module.exports = {
    addBlockedWord,
    getBlockedWords,
    updateBlockedWord,
    deleteBlockedWord
};