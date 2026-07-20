const express = require("express");

const router = express.Router();

const blockedWordController = require("../controllers/blockedWord.controller");

const { authUser, authAdmin } = require("../middlewares/auth.middleware");

router.post(
    "/",
    authUser,
    authAdmin,
    blockedWordController.addBlockedWord
);

router.get(
    "/",
    authUser,
    authAdmin,
    blockedWordController.getBlockedWords
);

router.patch(
    "/:id",
    authUser,
    authAdmin,
    blockedWordController.updateBlockedWord
);

router.delete(
    "/:id",
    authUser,
    authAdmin,
    blockedWordController.deleteBlockedWord
);

module.exports = router;