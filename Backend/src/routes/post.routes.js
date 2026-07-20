const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { canCreatePost } = require("../middlewares/posting.middleware");


/**
 * - Creating Posts
 */

router.post(
    "/",
    authUser,
    canCreatePost,
    upload.single("image"),
    postController.createPost
);


/**
 * - Get all Posts
 */

router.get("/", authUser, postController.getAllPosts);


/**
 * - Get Post By Id
 */

router.get("/:id", authUser, postController.getPostById);



/**
 * - Update Post By Id
 */

router.put("/:id", authUser, postController.updatePost);

/**
 * - Delete a Post
 */

router.delete("/:id", authUser, postController.deletePost);



module.exports = router;