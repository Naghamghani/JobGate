import React, { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    CardContent,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import { getMyJobsAPI, createJobAPI, deleteJobAPI, getAllCategoriesAPI } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, subtitle }) => (
    <Card sx={{ backgroundColor: '#AEE3E6', height: '100%' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);

export default function JobPostingsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        type: 'onsite',
        location: '',
        category: '',
        description: '',
        requirements: '',
        skills: '',
        salary: { min: 0, max: 0, currency: 'USD' },
        experience: 'any',
        status: 'active',
        deadline: '',
    });

    useEffect(() => {
        fetchJobs();
        fetchCategories();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await getMyJobsAPI();
            setJobs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getAllCategoriesAPI();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateJob = async () => {
        if (!formData.title || !formData.category || !formData.location || !formData.description) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const jobData = {
                ...formData,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
            };
            await createJobAPI(jobData);
            toast.success('Job created successfully');
            setDialogOpen(false);
            setFormData({
                title: '',
                type: 'onsite',
                location: '',
                category: '',
                description: '',
                requirements: '',
                skills: '',
                salary: { min: 0, max: 0, currency: 'USD' },
                experience: 'any',
                status: 'active',
                deadline: '',
            });
            fetchJobs();
        } catch (error) {
            console.error('Error creating job:', error);
            toast.error(error.message || 'Failed to create job');
        }
    };

    const handleDeleteJob = async (jobId, jobTitle) => {
        if (window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
            try {
                await deleteJobAPI(jobId);
                toast.success('Job deleted successfully');
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
                toast.error('Failed to delete job');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

    return (
        <Box>
            {/* Header with title and action button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Manage Job Postings
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
                    Create a Job
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard title="Active Jobs" value={activeJobs} subtitle={`${jobs.length} Total`} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Applicants" value={totalApplicants} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Job Views" value={totalViews} />
                </Grid>
            </Grid>

            {/* Job Postings Table */}
            <Card sx={{ borderRadius: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Job Title</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date Posted</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Applicants</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Views</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : jobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No jobs posted yet. Click "Create a Job" to get started!
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                jobs.map((job, index) => (
                                    <TableRow
                                        key={job._id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                                            '&:hover': { backgroundColor: '#f3f4f6' },
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>{job.title}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{job.type}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{formatDate(job.createdAt)}</TableCell>
                                        <TableCell sx={{ color: 'primary.main', fontWeight: 500 }}>{job.applicants || 0}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{job.views || 0}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={job.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: job.status === 'active' ? '#d1fae5' : '#fed7aa',
                                                    color: job.status === 'active' ? '#065f46' : '#92400e',
                                                    fontWeight: 500,
                                                    borderRadius: 2,
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        textTransform: 'none',
                                                        minWidth: 'auto',
                                                        borderColor: '#e5e7eb',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="small"
                                                    sx={{
                                                        textTransform: 'none',
                                                        minWidth: 'auto',
                                                        color: 'error.main',
                                                    }}
                                                    onClick={() => handleDeleteJob(job._id, job.title)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Create Job Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Job</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Job Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Job Type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <MenuItem value="remote">Remote</MenuItem>
                                    <MenuItem value="onsite">On-site</MenuItem>
                                    <MenuItem value="freelance">Freelance</MenuItem>
                                    <MenuItem value="hybrid">Hybrid</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Experience Level"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                >
                                    <MenuItem value="any">Any</MenuItem>
                                    <MenuItem value="entry">Entry Level</MenuItem>
                                    <MenuItem value="mid">Mid Level</MenuItem>
                                    <MenuItem value="senior">Senior</MenuItem>
                                    <MenuItem value="lead">Lead</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    multiline
                                    rows={4}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Requirements"
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Skills (comma separated)"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    placeholder="JavaScript, React, Node.js"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Min Salary"
                                    value={formData.salary.min}
                                    onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, min: Number(e.target.value) } })}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Salary"
                                    value={formData.salary.max}
                                    onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, max: Number(e.target.value) } })}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="Currency"
                                    value={formData.salary.currency}
                                    onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, currency: e.target.value } })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Application Deadline"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateJob} variant="contained">Create Job</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
