import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Box,
    Avatar,
    Typography,
    IconButton,
    Button,
    TextField,
    Collapse,
    Divider,
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbUpOutlined as ThumbUpOutlinedIcon,
    Comment as CommentIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import { likePostAPI, addCommentAPI } from '../api/PostAPI';
import { toast } from 'react-toastify';

export default function PostCard({ post, currentUserId, onUpdate }) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [localPost, setLocalPost] = useState(post);

    const isLiked = localPost.likes?.includes(currentUserId);
    const likeCount = localPost.likes?.length || 0;
    const commentCount = localPost.comments?.length || 0;

    const handleLike = async () => {
        try {
            const result = await likePostAPI(localPost._id);

            // Update local state
            setLocalPost({
                ...localPost,
                likes: result.liked
                    ? [...(localPost.likes || []), currentUserId]
                    : (localPost.likes || []).filter(id => id !== currentUserId)
            });

            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error liking post:', error);
            toast.error('Failed to like post');
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            setSubmittingComment(true);
            const updatedPost = await addCommentAPI(localPost._id, commentText);
            setLocalPost(updatedPost);
            setCommentText('');
            toast.success('Comment added');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <Card sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
                {/* Post Header */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar
                        src={localPost.authorImage}
                        sx={{ width: 48, height: 48, backgroundColor: '#2FA4A9' }}
                    >
                        {localPost.authorName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {localPost.authorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(localPost.createdAt)}
                        </Typography>
                    </Box>
                </Box>

                {/* Post Content */}
                <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {localPost.description}
                </Typography>

                {/* Post Image */}
                {localPost.image && (
                    <Box sx={{ mb: 2 }}>
                        <img
                            src={localPost.image}
                            alt="Post"
                            style={{
                                width: '100%',
                                maxHeight: '500px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                    </Box>
                )}

                {/* Engagement Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        fullWidth
                        startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                        onClick={handleLike}
                        sx={{
                            color: isLiked ? '#2FA4A9' : 'text.secondary',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#F0F9FA',
                            },
                        }}
                    >
                        Like
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<CommentIcon />}
                        onClick={() => setShowComments(!showComments)}
                        sx={{
                            color: 'text.secondary',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#F0F9FA',
                            },
                        }}
                    >
                        Comment
                    </Button>
                </Box>

                {/* Comments Section */}
                <Collapse in={showComments}>
                    <Box sx={{ mt: 2 }}>
                        {/* Add Comment */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment();
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#2FA4A9',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#2FA4A9',
                                        },
                                    },
                                }}
                            />
                            <IconButton
                                onClick={handleAddComment}
                                disabled={!commentText.trim() || submittingComment}
                                sx={{ color: '#2FA4A9' }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>

                        {/* Comments List */}
                        {localPost.comments && localPost.comments.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {localPost.comments.map((comment) => (
                                    <Box key={comment._id} sx={{ display: 'flex', gap: 1 }}>
                                        <Avatar
                                            src={comment.userImage}
                                            sx={{ width: 32, height: 32, backgroundColor: '#2FA4A9' }}
                                        >
                                            {comment.userName?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box
                                            sx={{
                                                flex: 1,
                                                backgroundColor: '#F2F4F6',
                                                borderRadius: 2,
                                                p: 1.5,
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {comment.userName}
                                            </Typography>
                                            <Typography variant="body2">{comment.text}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                {formatTimeAgo(comment.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}
