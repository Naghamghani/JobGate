import React, { useState, useEffect, useRef } from 'react';
import {
    Typography,
    Grid,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Chip,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Business as BusinessIcon,
    PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { getUserProfile, updateUserProfile } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

export default function CompanyProfilePage() {
    const [companyData, setCompanyData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    const fetchCompanyProfile = async () => {
        try {
            const profile = await getUserProfile();
            setCompanyData(profile);
            setFormData({
                name: profile.name || '',
                location: profile.location || '',
                category: profile.category || '',
                about: profile.about || '',
                website: profile.website || '',
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching company profile:', error);
            toast.error('Failed to load company profile');
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (event) => {
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

        try {
            setUploading(true);

            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64Image = reader.result;
                    await updateUserProfile({ imageLink: base64Image });
                    setCompanyData({ ...companyData, imageLink: base64Image });
                    toast.success('Profile image updated successfully');
                    setUploading(false);
                } catch (error) {
                    console.error('Error uploading image:', error);
                    toast.error('Failed to upload image');
                    setUploading(false);
                }
            };

            reader.onerror = () => {
                toast.error('Failed to read image file');
                setUploading(false);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            toast.error('Failed to process image');
            setUploading(false);
        }
    };

    const handleEditToggle = () => {
        if (editMode) {
            // Cancel edit - reset form data
            setFormData({
                name: companyData.name || '',
                location: companyData.location || '',
                category: companyData.category || '',
                about: companyData.about || '',
                website: companyData.website || '',
            });
        }
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Validate required fields
            if (!formData.name.trim()) {
                toast.error('Company name is required');
                setSaving(false);
                return;
            }

            // Prepare update data - explicitly include all fields
            const updateData = {
                name: formData.name,
                location: formData.location,
                category: formData.category,
                about: formData.about,
                website: formData.website,
            };

            console.log('Sending data to backend:', updateData);

            // Update profile
            const updatedProfile = await updateUserProfile(updateData);

            console.log('Received from backend:', updatedProfile);

            // Update local state with response from backend
            setCompanyData(updatedProfile);

            // Update form data to match saved data
            setFormData({
                name: updatedProfile.name || '',
                location: updatedProfile.location || '',
                category: updatedProfile.category || '',
                about: updatedProfile.about || '',
                website: updatedProfile.website || '',
            });

            setEditMode(false);
            toast.success('Profile updated successfully');
            setSaving(false);

            // Refresh profile from backend to ensure sync
            await fetchCompanyProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress sx={{ color: '#2FA4A9' }} />
            </Box>
        );
    }

    if (!companyData) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    No company data found
                </Typography>
            </Box>
        );
    }

    const avatarLetters = companyData.name?.substring(0, 2).toUpperCase() || 'CO';

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Company Profile
                </Typography>
                {!editMode ? (
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditToggle}
                        sx={{
                            backgroundColor: '#2FA4A9',
                            '&:hover': { backgroundColor: '#258A8E' },
                        }}
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleEditToggle}
                            sx={{
                                borderColor: '#7A7A7A',
                                color: '#7A7A7A',
                                '&:hover': { borderColor: '#4A4A4A', backgroundColor: '#F2F4F6' },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={saving}
                            sx={{
                                backgroundColor: '#2FA4A9',
                                '&:hover': { backgroundColor: '#258A8E' },
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Company Overview Card */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                {companyData.imageLink ? (
                                    <Avatar
                                        src={companyData.imageLink}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            margin: '0 auto',
                                            mb: 2,
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            margin: '0 auto',
                                            backgroundColor: '#2FA4A9',
                                            fontSize: '3rem',
                                            mb: 2,
                                        }}
                                    >
                                        {avatarLetters}
                                    </Avatar>
                                )}

                                <IconButton
                                    onClick={handleImageClick}
                                    disabled={uploading}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        right: -8,
                                        backgroundColor: '#2FA4A9',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#258A8E',
                                        },
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    {uploading ? (
                                        <CircularProgress size={20} sx={{ color: 'white' }} />
                                    ) : (
                                        <PhotoCameraIcon />
                                    )}
                                </IconButton>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </Box>

                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                {companyData.name || 'Company Name'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {companyData.category || 'Category'}
                            </Typography>
                            <Chip
                                icon={<BusinessIcon />}
                                label={companyData.role}
                                sx={{
                                    backgroundColor: '#AEE3E6',
                                    color: '#2FA4A9',
                                    fontWeight: 600,
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Company Information Card */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Company Information
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        name="name"
                                        value={editMode ? formData.name : companyData.name || ''}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={companyData.email || ''}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Category"
                                        name="category"
                                        value={editMode ? formData.category : companyData.category || ''}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        name="location"
                                        value={editMode ? formData.location : companyData.location || 'Not specified'}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                        placeholder="e.g., New York, USA"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Website"
                                        name="website"
                                        value={editMode ? formData.website : companyData.website || 'Not specified'}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                        placeholder="https://www.company.com"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="User ID"
                                        value={companyData.userID || ''}
                                        InputProps={{ readOnly: true }}
                                        helperText="User ID cannot be changed"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Member Since"
                                        value={companyData.createdAt ? new Date(companyData.createdAt).toLocaleDateString() : 'N/A'}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="About"
                                        name="about"
                                        value={editMode ? formData.about : companyData.about || 'No description available'}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={4}
                                        InputProps={{ readOnly: !editMode }}
                                        placeholder="Tell us about your company..."
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
