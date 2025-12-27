import React, { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
} from '@mui/material';
import {
    Business as BusinessIcon,
} from '@mui/icons-material';
import { getAllCategoriesAPI, createCategory, deleteCategoryAPI } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

const CategoryCard = ({ category, onDelete }) => (
    <Card
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
            },
        }}
    >
        <CardContent sx={{ flexGrow: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        backgroundColor: '#3b82f615',
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3b82f6',
                    }}
                >
                    <BusinessIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {category.name}
                </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {category.description || 'No description'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                    label={`${category.jobCount || 0} Jobs`}
                    size="small"
                    sx={{
                        backgroundColor: '#AEE3E6',
                        color: '#2FA4A9',
                        fontWeight: 500,
                    }}
                />
            </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
            <Button
                size="small"
                sx={{ textTransform: 'none', color: 'error.main' }}
                onClick={() => onDelete(category._id, category.name)}
            >
                Delete
            </Button>
        </CardActions>
    </Card>
);

export default function CompanyCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        icon: 'BusinessIcon',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategoriesAPI();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            await createCategory(formData);
            toast.success('Category created successfully');
            setDialogOpen(false);
            setFormData({ name: '', icon: 'BusinessIcon', description: '' });
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error(error.message || 'Failed to create category');
        }
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (window.confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
            try {
                await deleteCategoryAPI(categoryId);
                toast.success('Category deleted successfully');
                fetchCategories(); // Refresh the list
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Failed to delete category');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        Company Categories
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Manage and organize company categories across the platform
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setDialogOpen(true)}
                    sx={{
                        backgroundColor: 'primary.main',
                        textTransform: 'none',
                        px: 3,
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    }}
                >
                    + Add Category
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : categories.length === 0 ? (
                <Card sx={{ p: 8, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No categories found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Click "Add Category" to create your first category
                    </Typography>
                </Card>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {categories.map((category) => (
                            <Grid item xs={12} md={6} lg={4} key={category._id}>
                                <CategoryCard category={category} onDelete={handleDeleteCategory} />
                            </Grid>
                        ))}
                    </Grid>

                    <Card sx={{ mt: 4, backgroundColor: '#f9fafb' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                Category Statistics
                            </Typography>
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={4}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            {categories.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Categories
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                                            {categories.reduce((sum, cat) => sum + (cat.jobCount || 0), 0)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Job Listings
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Add Category Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateCategory} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
