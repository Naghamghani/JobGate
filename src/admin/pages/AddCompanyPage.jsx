import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { adminCreateCompanyAPI, getAllCategoriesAPI } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

export default function AddCompanyPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        category: '',
        about: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategoriesAPI();
            setCategories(data.map(cat => cat.name));
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories(["Technology", "Finance", "Healthcare", "Retail", "Education", "Other"]);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields (Name, Email, Password)');
            return;
        }

        if (!formData.location || !formData.category || !formData.about) {
            setError('Please fill in all company details (Location, Category, About)');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            await adminCreateCompanyAPI(formData);
            setSuccess('Company created successfully!');
            toast.success('Company created successfully!');
            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                location: '',
                category: '',
                about: '',
            });
        } catch (error) {
            console.error('Error creating company:', error);
            setError(error.message || 'Failed to create company');
            toast.error(error.message || 'Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, color: 'text.primary', fontWeight: 600 }}>
                Add New Company
            </Typography>

            <Card sx={{ maxWidth: 800, mx: 'auto' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                backgroundColor: '#AEE3E6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <BusinessIcon sx={{ color: '#2FA4A9', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Company Registration
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new company account
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Company Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Company Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email *"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="company@example.com"
                                />
                            </Grid>

                            {/* Password */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Password *"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 6 characters"
                                />
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Location *"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., New York, USA"
                                />
                            </Grid>

                            {/* Category */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Category *</InputLabel>
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        label="Category *"
                                        onChange={handleChange}
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat} value={cat}>
                                                {cat}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* About */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="About *"
                                    name="about"
                                    multiline
                                    rows={4}
                                    value={formData.about}
                                    onChange={handleChange}
                                    placeholder="Describe the company..."
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                                        py: 1.5,
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)',
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Company'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
