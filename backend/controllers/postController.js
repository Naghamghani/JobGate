const Post = require("../models/Post");

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate("author", "name email imageLink")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email imageLink")
            .populate("comments.user", "name imageLink");

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { description, image } = req.body;

        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        // Fetch current user to get latest profile image
        const User = require("../models/User");
        const currentUser = await User.findById(req.user._id);

        const post = await Post.create({
            author: req.user._id,
            authorName: currentUser.name,
            authorImage: currentUser.imageLink || "",
            description,
            image: image || "",
        });

        if (post) {
            res.status(201).json(post);
        } else {
            res.status(400).json({ message: "Invalid post data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author only)
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is the post author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this post" });
        }

        post.description = req.body.description || post.description;
        post.image = req.body.image !== undefined ? req.body.image : post.image;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is the post author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.json({ message: "Post removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user already liked the post
        const alreadyLiked = post.likes.some(
            (like) => like.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
            // Unlike: remove user from likes array
            post.likes = post.likes.filter(
                (like) => like.toString() !== req.user._id.toString()
            );
        } else {
            // Like: add user to likes array
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ likes: post.likes.length, liked: !alreadyLiked });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = {
            user: req.user._id,
            userName: req.user.name,
            userImage: req.user.imageLink || "",
            text,
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json(post.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment from post
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private (Comment author only)
const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user is the comment author
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        comment.deleteOne();
        await post.save();

        res.json({ message: "Comment removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my posts (logged in user)
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get posts by company ID
// @route   GET /api/posts/company/:companyId
// @access  Public
const getPostsByCompany = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.companyId })
            .populate("author", "name email imageLink")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
