const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
const { uploadFile, deleteFile } = require("../services/storage.service");
const moderateImage = require("../services/imageModeration.service");
const moderateCaption = require("../services/textModeration.service")
const { sendViolationEmail } = require("../services/mail.service");
const compressImage = require("../services/imageProcessor.service");
const { suspendPosting } = require("../services/userStatus.service");
const { checkBlockedWords } = require("../services/blockedWord.service");




async function createPost(req, res) {
    try {
        // console.log("1. Entered createPost");

        const { caption } = req.body;
        // console.log("2. Caption:", caption);

        if (!req.file) {
            console.log("3. No file received");

            return res.status(400).json({
                message: "Image is required"
            });
        }

        console.log(
            "Original:",
            (req.file.buffer.length / 1024 / 1024).toFixed(2),
            "MB"
        );

        const compressedBuffer = await compressImage(req.file.buffer);

        console.log(
            "Compressed:",
            (compressedBuffer.length / 1024 / 1024).toFixed(2),
            "MB"
        );
        // console.log("4. File received");

        console.time("Moderation")


        const [imageModeration, textModeration] = await Promise.all([
            moderateImage(compressedBuffer),
            moderateCaption(caption)
        ]);

        console.timeEnd("Moderation")

        const violations = [];
        const user = await UserModel.findById(req.user.id);
        if (!imageModeration.safe) {
            violations.push({
                type: "image",
                reasons: imageModeration.violations
            });

            await suspendPosting(user, "Explicit image detected");

        }

        if (!textModeration.safe) {
            violations.push({
                type: "caption",
                reasons: textModeration.violations
            });
        }


        if (violations.length > 0) {



            if (user) {
                sendViolationEmail(user, violations)
                    .catch(err => console.error(err));
            }

            return res.status(400).json({
                message: "Post violates community guidelines.",
                violations
            });
        }


        console.time("Image Upload");

        const uploadedImage = await uploadFile(compressedBuffer);
        console.timeEnd("Image Upload");
        // console.log("5. Image uploaded:", imageUrl);

        if (!uploadedImage.url) {
            return res.status(500).json({
                message: "Image upload failed"
            });
        }

        console.time("Mongo Save");

        const post = await PostModel.create({
            author: req.user.id,
            image: uploadedImage.url,
            imageFileId: uploadedImage.fileId,
            caption
        });

        console.timeEnd("Mongo Save");

        // console.log("6. Post saved");

        return res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getAllPosts(req, res) {
    try {
        const posts = await PostModel.find()
            .populate("author", "username fullName profilePicture")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            posts
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function getPostById(req, res) {
    try {
        const { id } = req.params;

        const post = await PostModel.findById(id)
            .populate("author", "username fullName profilePicture");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            post
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const { caption } = req.body;
        if (!caption) {
            return res.status(400).json({
                message: "Caption is required"
            });
        }

        const post = await PostModel.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Authorization: Only the author can edit their own post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to update this post"
            });
        }

        post.caption = caption;
        await post.save();

        return res.status(200).json({
            message: "Post updated successfully",
            post
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function deletePost(req, res) {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Authorization
        if (
            post.author.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "You are not authorized to delete this post"
            });
        }

        await deleteFile(post.imageFileId);

        await post.deleteOne();

        return res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function toggleLikePost(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await PostModel.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        const isLiked = post.likes.some(
            (likeUserId) => likeUserId.toString() === userId
        );

        if (isLiked) {
            post.likes = post.likes.filter(
                (likeUserId) => likeUserId.toString() !== userId
            );
        } else {
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            message: isLiked ? "Post unliked" : "Post liked",
            likes: post.likes,
            likesCount: post.likes.length,
            isLiked: !isLiked
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLikePost
};