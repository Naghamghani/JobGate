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
    Avatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import {
    Close as CloseIcon,
    Download as DownloadIcon,
    Notifications as NotifyIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import StatCard from '../components/StatCard';
import { getAllApplicationsAPI, notifyApplicantAPI } from '../../api/ApplicationAPI';
import { toast } from 'react-toastify';

const getStatusColor = (status) => {
    switch (status) {
        case 'shortlisted':
            return { bg: '#d1fae5', color: '#065f46' };
        case 'rejected':
            return { bg: '#fee2e2', color: '#991b1b' };
        case 'pending':
            return { bg: '#fed7aa', color: '#92400e' };
        default:
            return { bg: '#f3f4f6', color: '#374151' };
    }
};

export default function JobApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notifying, setNotifying] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, statusFilter, searchQuery]);

    const fetchApplications = async () => {
        try {
            const data = await getAllApplicationsAPI();
            setApplications(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = applications;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(app =>
                app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.companyName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    };

    const handleNotify = async (applicationId) => {
        try {
            setNotifying(true);
            await notifyApplicantAPI(applicationId);
            toast.success('Email notification sent successfully!');
            fetchApplications();
            setNotifying(false);
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error(error.message || 'Failed to send notification');
            setNotifying(false);
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setDialogOpen(true);
    };

    const handleDownloadCV = (application) => {
        const link = document.createElement('a');
        link.href = application.cv;
        link.download = application.cvFileName || `CV_${application.applicantName}.pdf`;
        link.click();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#2FA4A9' }} />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
                Job Applications
            </Typography>

            {/* Search and Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by applicant, position, or company..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="shortlisted">Shortlisted</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Statistics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <StatCard title="Total Applications" value={stats.total} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Pending Review" value={stats.pending} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Shortlisted" value={stats.shortlisted} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Rejected" value={stats.rejected} />
                </Grid>
            </Grid>

            {/* Applications Table */}
            <Card sx={{ borderRadius: 3, border: '2px solid #AEE3E6' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#0f172a' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Applicant</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Position</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Company</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Applied Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredApplications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No applications found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApplications.map((app) => {
                                    const statusColors = getStatusColor(app.status);
                                    return (
                                        <TableRow
                                            key={app._id}
                                            sx={{
                                                '&:hover': { backgroundColor: '#f9fafb' },
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {app.applicant?.imageLink ? (
                                                        <Avatar src={app.applicant.imageLink} sx={{ width: 40, height: 40 }} />
                                                    ) : (
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor: '#10b981',
                                                                width: 40,
                                                                height: 40,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {app.applicantName?.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    )}
                                                    <Typography sx={{ fontWeight: 500 }}>{app.applicantName}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{app.jobTitle}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>{app.companyName}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>{formatDate(app.createdAt)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: statusColors.bg,
                                                        color: statusColors.color,
                                                        fontWeight: 500,
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        size="small"
                                                        startIcon={<ViewIcon />}
                                                        onClick={() => handleViewDetails(app)}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        View
                                                    </Button>
                                                    {app.status !== 'pending' && !app.notified && (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            startIcon={<NotifyIcon />}
                                                            onClick={() => handleNotify(app._id)}
                                                            disabled={notifying}
                                                            sx={{
                                                                textTransform: 'none',
                                                                backgroundColor: '#2FA4A9',
                                                                '&:hover': { backgroundColor: '#258A8E' },
                                                            }}
                                                        >
                                                            Notify
                                                        </Button>
                                                    )}
                                                    {app.notified && (
                                                        <Chip
                                                            label="Notified"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#d1fae5',
                                                                color: '#065f46',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* View Details Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                {selectedApplication && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Application Details
                                </Typography>
                                <IconButton onClick={() => setDialogOpen(false)} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        {selectedApplication.applicant?.imageLink ? (
                                            <Avatar src={selectedApplication.applicant.imageLink} sx={{ width: 60, height: 60 }} />
                                        ) : (
                                            <Avatar sx={{ width: 60, height: 60, backgroundColor: '#2FA4A9', fontSize: '1.5rem' }}>
                                                {selectedApplication.applicantName?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        )}
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {selectedApplication.applicantName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedApplication.applicantEmail}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Position</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedApplication.jobTitle}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Company</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedApplication.companyName}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Experience</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedApplication.experience}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Current Location</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedApplication.currentLocation}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Expected Salary</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        ${selectedApplication.expectedSalary?.toLocaleString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                                        size="small"
                                        sx={{
                                            mt: 0.5,
                                            backgroundColor: getStatusColor(selectedApplication.status).bg,
                                            color: getStatusColor(selectedApplication.status).color,
                                        }}
                                    />
                                </Grid>

                                {selectedApplication.coverLetter && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">Cover Letter</Typography>
                                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                                            {selectedApplication.coverLetter}
                                        </Typography>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        onClick={() => handleDownloadCV(selectedApplication)}
                                        fullWidth
                                        sx={{
                                            borderColor: '#2FA4A9',
                                            color: '#2FA4A9',
                                            '&:hover': {
                                                borderColor: '#258A8E',
                                                backgroundColor: '#F0F9FA',
                                            },
                                        }}
                                    >
                                        Download CV ({selectedApplication.cvFileName})
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            {selectedApplication.status !== 'pending' && !selectedApplication.notified && (
                                <Button
                                    variant="contained"
                                    startIcon={<NotifyIcon />}
                                    onClick={() => {
                                        handleNotify(selectedApplication._id);
                                        setDialogOpen(false);
                                    }}
                                    disabled={notifying}
                                    sx={{
                                        backgroundColor: '#2FA4A9',
                                        '&:hover': { backgroundColor: '#258A8E' },
                                    }}
                                >
                                    Send Email Notification
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
