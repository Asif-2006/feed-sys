const UserModel = require("../models/user.model");
const {
    blockUser,
    unblockUser
} = require("../services/userStatus.service");

const { sendBlockEmail , sendUnblockEmail  } = require("../services/mail.service");

async function blockUserController(req, res) {
    try {

        const { id } = req.params;
        const { reason } = req.body;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (user.status === "blocked") {
            return res.status(400).json({
                message: "User is already blocked."
            });
        }

        await blockUser(user, reason);

        sendBlockEmail(user, reason)
            .catch(console.error);

        return res.status(200).json({
            message: "User blocked successfully."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function unblockUserController(req, res) {
    try {

        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (user.status === "active") {
            return res.status(400).json({
                message: "User is already active."
            });
        }

        await unblockUser(user);

        sendUnblockEmail(user)
            .catch(console.error);

        return res.status(200).json({
            message: "User unblocked successfully."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}





module.exports = {
    blockUserController,
    unblockUserController
};