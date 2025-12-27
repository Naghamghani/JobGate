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
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
    Notifications as NotifyIcon,
} from '@mui/icons-material';
import { getCompanyApplicationsAPI, updateApplicationStatusAPI, notifyApplicantAPI } from '../../api/ApplicationAPI';
import { toast } from 'react-toastify';

const getStatusColor = (status) => {
    switch (status) {
        case 'shortlisted':
            return { bg: '#d1fae5', color: '#065f46' };
        case 'rejected':
            return { bg: '#fee2e2', color: '#991b1b' };
        case 'pending':
            return { bg: '#e0e7ff', color: '#3730a3' };
        default:
            return { bg: '#f3f4f6', color: '#374151' };
    }
};

export default function CandidatesPage() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, statusFilter, searchQuery]);

    const fetchApplications = async () => {
        try {
            const data = await getCompanyApplicationsAPI();
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

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(app =>
                app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await updateApplicationStatusAPI(applicationId, newStatus);
            toast.success(`Application ${newStatus} successfully`);
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setDialogOpen(true);
    };

    const handleDownloadCV = (application) => {
        // Create a download link for the CV
        const link = document.createElement('a');
        link.href = application.cv;
        link.download = application.cvFileName || `CV_${application.applicantName}.pdf`;
        link.click();
    };

    const handleNotify = async (applicationId) => {
        try {
            await notifyApplicantAPI(applicationId);
            toast.success('Candidate notified successfully');
            fetchApplications();
        } catch (error) {
            console.error('Error notifying candidate:', error);
            toast.error(error.message || 'Failed to notify candidate');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Calculate statistics
    const stats = {
        total: applications.length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        pending: applications.filter(app => app.status === 'pending').length,
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
            <Typography variant="h4" sx={{ mb: 4, color: 'text.primary', fontWeight: 600 }}>
                Candidates
            </Typography>

            {/* Search and Filter Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search candidates by name or position..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e5e7eb',
                            },
                        },
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e5e7eb',
                            },
                        }}
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
                    <Card sx={{ backgroundColor: '#AEE3E6' }}>
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {stats.total}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Applications
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ backgroundColor: '#d1fae5' }}>
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                                {stats.shortlisted}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Shortlisted
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ backgroundColor: '#e0e7ff' }}>
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>
                                {stats.pending}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pending Review
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{ backgroundColor: '#fee2e2' }}>
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                                {stats.rejected}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Rejected
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Applications Table */}
            <Card sx={{ borderRadius: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Candidate</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Applied Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredApplications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No applications found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApplications.map((application, index) => {
                                    const statusColors = getStatusColor(application.status);
                                    return (
                                        <TableRow
                                            key={application._id}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                                                '&:hover': { backgroundColor: '#f3f4f6' },
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {application.applicant?.imageLink ? (
                                                        <Avatar src={application.applicant.imageLink} sx={{ width: 40, height: 40 }} />
                                                    ) : (
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor: '#2FA4A9',
                                                                width: 40,
                                                                height: 40,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {application.applicantName?.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    )}
                                                    <Typography sx={{ fontWeight: 500 }}>{application.applicantName}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{application.jobTitle}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>{application.experience}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>{application.currentLocation}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>{formatDate(application.createdAt)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
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
                                                        variant="outlined"
                                                        startIcon={<ViewIcon />}
                                                        onClick={() => handleViewDetails(application)}
                                                        sx={{
                                                            textTransform: 'none',
                                                            borderColor: '#e5e7eb',
                                                            color: 'text.secondary',
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                    {application.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    backgroundColor: '#10b981',
                                                                    '&:hover': { backgroundColor: '#059669' },
                                                                }}
                                                            >
                                                                Shortlist
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    borderColor: '#dc2626',
                                                                    color: '#dc2626',
                                                                    '&:hover': {
                                                                        borderColor: '#b91c1c',
                                                                        backgroundColor: '#fee2e2',
                                                                    },
                                                                }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {/* Notify button for shortlisted/rejected applications */}
                                                    {(application.status === 'shortlisted' || application.status === 'rejected') && !application.notified && (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            startIcon={<NotifyIcon />}
                                                            onClick={() => handleNotify(application._id)}
                                                            sx={{
                                                                textTransform: 'none',
                                                                backgroundColor: '#2FA4A9',
                                                                '&:hover': { backgroundColor: '#258A8E' },
                                                            }}
                                                        >
                                                            Notify
                                                        </Button>
                                                    )}
                                                    {application.notified && (
                                                        <Chip
                                                            label="Notified"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#dbeafe',
                                                                color: '#1d4ed8',
                                                                fontWeight: 500,
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
                            {selectedApplication.status === 'pending' && (
                                <>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            handleStatusUpdate(selectedApplication._id, 'rejected');
                                            setDialogOpen(false);
                                        }}
                                        sx={{
                                            borderColor: '#dc2626',
                                            color: '#dc2626',
                                            '&:hover': {
                                                borderColor: '#b91c1c',
                                                backgroundColor: '#fee2e2',
                                            },
                                        }}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            handleStatusUpdate(selectedApplication._id, 'shortlisted');
                                            setDialogOpen(false);
                                        }}
                                        sx={{
                                            backgroundColor: '#10b981',
                                            '&:hover': { backgroundColor: '#059669' },
                                        }}
                                    >
                                        Shortlist
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
