// services/userStatus.service.js

async function suspendPosting(user, reason, hours = 24) {
    user.strikeCount += 1;

    user.postingStatus = "suspended";
    user.postingSuspensionReason = reason;
    user.postingSuspensionExpiresAt = new Date(
        Date.now() + hours * 60 * 60 * 1000
    );

    await user.save();

    return user;
}

async function unsuspendPosting(user) {
    user.postingStatus = "active";
    user.postingSuspensionReason = "";
    user.postingSuspensionExpiresAt = null;

    await user.save();

    return user;
}

async function blockUser(user, reason) {
    user.status = "blocked";
    user.blockedReason = reason;

    await user.save();

    return user;
}

async function unblockUser(user) {
    user.status = "active";
    user.blockedReason = "";

    await user.save();

    return user;
}

module.exports = {
    suspendPosting,
    unsuspendPosting,
    blockUser,
    unblockUser
};