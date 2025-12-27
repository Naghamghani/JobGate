import React, { useState, useEffect, useRef } from 'react';
import {
    Typography,
    Grid,
    Box,
    Card,
    CardContent,
    Button,
    TextField,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    ThumbUp as ThumbUpIcon,
    ThumbUpOutlined as ThumbUpOutlinedIcon,
    Comment as CommentIcon,
    Share as ShareIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { getMyPostsAPI, createPostAPI, deletePostAPI, likePostAPI } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

const PostCard = ({ post, onDelete, onLike, currentUserId }) => {
    const isLiked = post.likes?.includes(currentUserId);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {post.authorImage ? (
                            <Avatar src={post.authorImage} sx={{ width: 48, height: 48 }} />
                        ) : (
                            <Avatar sx={{ backgroundColor: '#2FA4A9', width: 48, height: 48 }}>
                                {post.authorName?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        )}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {post.authorName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(post.createdAt)}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton size="small" onClick={() => onDelete(post._id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {post.description}
                </Typography>

                {post.image && (
                    <Box
                        component="img"
                        src={post.image}
                        alt="Post"
                        sx={{
                            width: '100%',
                            maxHeight: 400,
                            objectFit: 'cover',
                            borderRadius: 2,
                            mb: 2,
                        }}
                    />
                )}

                <Box sx={{ display: 'flex', gap: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                        onClick={() => onLike(post._id)}
                    >
                        {isLiked ? (
                            <ThumbUpIcon sx={{ fontSize: 20, color: '#2FA4A9' }} />
                        ) : (
                            <ThumbUpOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        )}
                        <Typography variant="body2" color={isLiked ? 'primary' : 'text.secondary'}>
                            {post.likes?.length || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                        <CommentIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {post.comments?.length || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                        <ShareIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            Share
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newPost, setNewPost] = useState({ description: '', image: '' });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getMyPostsAPI();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to load posts');
            setLoading(false);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewPost({ ...newPost, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleCreatePost = async () => {
        if (!newPost.description.trim()) {
            toast.error('Please enter post description');
            return;
        }

        try {
            setUploading(true);
            await createPostAPI(newPost);
            toast.success('Post created successfully');
            setDialogOpen(false);
            setNewPost({ description: '', image: '' });
            fetchPosts();
            setUploading(false);
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.message || 'Failed to create post');
            setUploading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePostAPI(postId);
                toast.success('Post deleted successfully');
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Failed to delete post');
            }
        }
    };

    const handleLikePost = async (postId) => {
        try {
            await likePostAPI(postId);
            fetchPosts(); // Refresh to get updated likes
        } catch (error) {
            console.error('Error liking post:', error);
            toast.error('Failed to like post');
        }
    };

    const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Posts
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                    sx={{
                        backgroundColor: 'primary.main',
                        px: 3,
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    }}
                >
                    Create Post
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#AEE3E6' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {posts.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Posts
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#fef3c7' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                                {totalLikes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Likes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: '#d1fae5' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                                {totalComments}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Comments
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Posts List */}
            <Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : posts.length === 0 ? (
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No posts yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Click "Create Post" to share your first update
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onDelete={handleDeletePost}
                            onLike={handleLikePost}
                            currentUserId={currentUserId}
                        />
                    ))
                )}
            </Box>

            {/* Create Post Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            placeholder="What do you want to share?"
                            value={newPost.description}
                            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />

                        {newPost.image && (
                            <Box sx={{ position: 'relative', mb: 2 }}>
                                <Box
                                    component="img"
                                    src={newPost.image}
                                    alt="Preview"
                                    sx={{
                                        width: '100%',
                                        maxHeight: 300,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                    }}
                                />
                                <IconButton
                                    onClick={() => setNewPost({ ...newPost, image: '' })}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}

                        <Button
                            variant="outlined"
                            startIcon={<PhotoCameraIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            fullWidth
                        >
                            {newPost.image ? 'Change Image' : 'Add Image (Optional)'}
                        </Button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreatePost}
                        variant="contained"
                        disabled={!newPost.description.trim() || uploading}
                    >
                        {uploading ? <CircularProgress size={24} /> : 'Post'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
