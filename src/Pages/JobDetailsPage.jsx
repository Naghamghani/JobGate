import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Avatar,
    CircularProgress,
    Grid,
    Divider,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    Visibility as ViewsIcon,
    People as ApplicantsIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobByIdAPI } from '../api/JobAPI';
import { getUserApplicationsAPI } from '../api/ApplicationAPI';
import ApplicationModal from '../components/ApplicationModal';
import { toast } from 'react-toastify';

export default function JobDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [checkingApplication, setCheckingApplication] = useState(true);

    useEffect(() => {
        fetchJobDetails();
        checkIfApplied();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const data = await getJobByIdAPI(id);
            setJob(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('Failed to load job details');
            setLoading(false);
        }
    };

    const checkIfApplied = async () => {
        try {
            const applications = await getUserApplicationsAPI();
            const applied = applications.some(app => app.job === id || app.job?._id === id);
            setHasApplied(applied);
            setCheckingApplication(false);
        } catch (error) {
            console.error('Error checking application:', error);
            setCheckingApplication(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#2FA4A9' }} />
            </Box>
        );
    }

    if (!job) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Job not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Card */}
            <Card sx={{ mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
                            {/* Company Logo */}
                            {job.company?.imageLink ? (
                                <Avatar
                                    src={job.company.imageLink}
                                    sx={{ width: 80, height: 80 }}
                                />
                            ) : (
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: '#2FA4A9',
                                        fontSize: '2rem',
                                    }}
                                >
                                    {job.companyName?.charAt(0).toUpperCase()}
                                </Avatar>
                            )}

                            {/* Job Title & Company */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {job.title}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                    {job.companyName}
                                </Typography>

                                {/* Quick Info */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {job.location}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <WorkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {job.type}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ApplicantsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {job.applicants || 0} applicants
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ViewsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {job.views || 0} views
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Apply Button */}
                        {hasApplied ? (
                            <Button
                                variant="contained"
                                size="large"
                                disabled
                                startIcon={<CheckIcon />}
                                sx={{
                                    backgroundColor: '#10b981',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    '&.Mui-disabled': {
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        opacity: 0.9,
                                    },
                                }}
                            >
                                Applied
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => setModalOpen(true)}
                                disabled={checkingApplication}
                                sx={{
                                    background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(47, 164, 169, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)',
                                    },
                                }}
                            >
                                {checkingApplication ? 'Loading...' : 'Apply Now'}
                            </Button>
                        )}
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={job.category}
                            sx={{
                                backgroundColor: '#AEE3E6',
                                color: '#2FA4A9',
                                fontWeight: 600,
                            }}
                        />
                        <Chip label={job.experience} variant="outlined" />
                        {job.salary?.min > 0 && (
                            <Chip
                                icon={<MoneyIcon />}
                                label={`${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`}
                                variant="outlined"
                            />
                        )}
                        {job.deadline && (
                            <Chip
                                icon={<CalendarIcon />}
                                label={`Deadline: ${formatDate(job.deadline)}`}
                                variant="outlined"
                                color="error"
                            />
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Job Details */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* Description */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Job Description
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                                {job.description}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    {job.requirements && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Requirements
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                                    {job.requirements}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Required Skills
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {job.skills.map((skill, index) => (
                                        <Chip key={index} label={skill} variant="outlined" />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    {/* Company Info */}
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                About Company
                            </Typography>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                {job.company?.imageLink ? (
                                    <Avatar
                                        src={job.company.imageLink}
                                        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mx: 'auto',
                                            mb: 2,
                                            backgroundColor: '#2FA4A9',
                                            fontSize: '2.5rem',
                                        }}
                                    >
                                        {job.companyName?.charAt(0).toUpperCase()}
                                    </Avatar>
                                )}
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {job.companyName}
                                </Typography>
                            </Box>

                            {job.company?.about && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {job.company.about}
                                    </Typography>
                                </>
                            )}

                            {job.company?.location && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationIcon sx={{ color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {job.company.location}
                                        </Typography>
                                    </Box>
                                </>
                            )}

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    mt: 3,
                                    color: '#2FA4A9',
                                    borderColor: '#2FA4A9',
                                    '&:hover': {
                                        borderColor: '#258A8E',
                                        backgroundColor: '#F0F9FA',
                                    },
                                }}
                                onClick={() => navigate(`/company-profile/${job.company._id}`)}
                            >
                                View Company Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Application Modal */}
            <ApplicationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                job={job}
                onSuccess={() => {
                    setModalOpen(false);
                    setHasApplied(true);
                    toast.success('Application submitted successfully!');
                }}
            />
        </Container>
    );
}
