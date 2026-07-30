const express = require("express");

const router = express.Router();
const { authUser, authAdmin } = require("../middlewares/auth.middleware");
const {
    blockUserController,
    unblockUserController
} = require("../controllers/admin.controller");

router.patch(
    "/block/:id",
    authUser,
    authAdmin,
    blockUserController
);

router.patch(
    "/unblock/:id",
    authUser,
    authAdmin,
    unblockUserController
);
module.exports = router;