const express = require("express");
const router = express.Router();
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    getMyPosts,
    getPostsByCompany,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllPosts);
router.get("/company/:companyId", getPostsByCompany);
router.get("/:id", getPostById);

// Protected routes
router.post("/", protect, createPost);
router.get("/my/posts", protect, getMyPosts);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, addComment);
router.delete("/:id/comment/:commentId", protect, deleteComment);

module.exports = router;
