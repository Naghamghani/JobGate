import React, { useState, useEffect } from 'react';
import { Box, Card, Avatar, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import { Image as ImageIcon, Close as CloseIcon } from '@mui/icons-material';
import { createPostAPI } from '../api/PostAPI';
import { getUserProfile } from '../api/AuthAPI';
import { toast } from 'react-toastify';

export default function CreatePost({ currentUser, onPostCreated }) {
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [posting, setPosting] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const profile = await getUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const avatarLetter = userProfile?.name?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U';

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handlePost = async () => {
        if (!postText.trim() && !selectedImage) {
            toast.error('Please add some text or an image');
            return;
        }

        try {
            setPosting(true);

            const postData = {
                description: postText,
                image: imagePreview || '',
            };

            await createPostAPI(postData);

            // Reset form
            setPostText('');
            setSelectedImage(null);
            setImagePreview(null);

            toast.success('Post created successfully!');

            // Notify parent to refresh posts
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post');
        } finally {
            setPosting(false);
        }
    };

    return (
        <Card sx={{ p: 2, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Avatar */}
                {userProfile?.imageLink || currentUser?.imageLink ? (
                    <Avatar
                        src={userProfile?.imageLink || currentUser?.imageLink}
                        sx={{ width: 48, height: 48 }}
                    />
                ) : (
                    <Avatar sx={{ width: 48, height: 48, backgroundColor: '#2FA4A9' }}>
                        {avatarLetter}
                    </Avatar>
                )}

                {/* Input Area */}
                <Box sx={{ flex: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="What do you want to talk about?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        variant="outlined"
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

                    {/* Image Preview */}
                    {imagePreview && (
                        <Box sx={{ position: 'relative', mt: 2 }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                            <IconButton
                                onClick={handleRemoveImage}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Box>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="post-image-upload"
                                type="file"
                                onChange={handleImageSelect}
                            />
                            <label htmlFor="post-image-upload">
                                <IconButton component="span" sx={{ color: '#2FA4A9' }}>
                                    <ImageIcon />
                                </IconButton>
                            </label>
                        </Box>

                        <Button
                            variant="contained"
                            onClick={handlePost}
                            disabled={posting || (!postText.trim() && !selectedImage)}
                            sx={{
                                background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                boxShadow: '0 4px 12px rgba(47, 164, 169, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)',
                                },
                                '&:disabled': {
                                    backgroundColor: '#E5E7EB',
                                },
                            }}
                        >
                            {posting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Post'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}
