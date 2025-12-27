import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
} from '@mui/material';
import {
    Close as CloseIcon,
    CloudUpload as UploadIcon,
    Description as FileIcon,
} from '@mui/icons-material';
import { applyForJobAPI } from '../api/ApplicationAPI';
import { getUserProfile } from '../api/AuthAPI';
import { toast } from 'react-toastify';

export default function ApplicationModal({ open, onClose, job, onSuccess }) {
    const [formData, setFormData] = useState({
        cv: '',
        cvFileName: '',
        expectedSalary: '',
        experience: '',
        currentLocation: '',
        coverLetter: '',
    });
    const [cvOption, setCvOption] = useState('upload'); // 'current' or 'upload'
    const [currentUserCV, setCurrentUserCV] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (open) {
            fetchUserProfile();
        }
    }, [open]);

    const fetchUserProfile = async () => {
        try {
            const profile = await getUserProfile();
            if (profile.cv && profile.cvFileName) {
                setCurrentUserCV({
                    cv: profile.cv,
                    cvFileName: profile.cvFileName,
                });
                // If user has a CV, default to using it
                setCvOption('current');
                setFormData(prev => ({
                    ...prev,
                    cv: profile.cv,
                    cvFileName: profile.cvFileName,
                }));
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleCVOptionChange = (event) => {
        const option = event.target.value;
        setCvOption(option);

        if (option === 'current' && currentUserCV) {
            setFormData({
                ...formData,
                cv: currentUserCV.cv,
                cvFileName: currentUserCV.cvFileName,
            });
            setError('');
        } else if (option === 'upload') {
            setFormData({
                ...formData,
                cv: '',
                cvFileName: '',
            });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a PDF or Word document');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                cv: reader.result,
                cvFileName: file.name,
            });
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.cv) {
            setError('Please upload your CV or select your current CV');
            return;
        }
        if (!formData.expectedSalary || formData.expectedSalary <= 0) {
            setError('Please enter expected salary');
            return;
        }
        if (!formData.experience) {
            setError('Please select your experience level');
            return;
        }
        if (!formData.currentLocation.trim()) {
            setError('Please enter your current location');
            return;
        }

        try {
            setLoading(true);
            await applyForJobAPI(job._id, formData);
            setLoading(false);
            onSuccess();
            handleClose();
        } catch (error) {
            setLoading(false);
            setError(error.message || 'Failed to submit application');
            toast.error(error.message || 'Failed to submit application');
        }
    };

    const handleClose = () => {
        setFormData({
            cv: '',
            cvFileName: '',
            expectedSalary: '',
            experience: '',
            currentLocation: '',
            coverLetter: '',
        });
        setCvOption('upload');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Apply for {job?.title}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* CV Selection */}
                    <Box sx={{ mb: 3 }}>
                        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                            CV/Resume *
                        </FormLabel>

                        <RadioGroup value={cvOption} onChange={handleCVOptionChange}>
                            {currentUserCV && (
                                <FormControlLabel
                                    value="current"
                                    control={<Radio sx={{ color: '#2FA4A9', '&.Mui-checked': { color: '#2FA4A9' } }} />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FileIcon sx={{ color: '#2FA4A9' }} />
                                            <Typography variant="body2">
                                                Use my current CV: <strong>{currentUserCV.cvFileName}</strong>
                                            </Typography>
                                        </Box>
                                    }
                                />
                            )}
                            <FormControlLabel
                                value="upload"
                                control={<Radio sx={{ color: '#2FA4A9', '&.Mui-checked': { color: '#2FA4A9' } }} />}
                                label="Upload a new CV"
                            />
                        </RadioGroup>

                        {cvOption === 'upload' && (
                            <Box sx={{ mt: 2 }}>
                                <Box
                                    sx={{
                                        border: '2px dashed #E5E7EB',
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: '#2FA4A9',
                                            backgroundColor: '#F0F9FA',
                                        },
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {formData.cvFileName && cvOption === 'upload' ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <FileIcon sx={{ color: '#2FA4A9', fontSize: 32 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {formData.cvFileName}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <UploadIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Click to upload CV (PDF or Word, max 5MB)
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Expected Salary */}
                    <TextField
                        fullWidth
                        label="Expected Salary (USD) *"
                        type="number"
                        value={formData.expectedSalary}
                        onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                        sx={{ mb: 3 }}
                        InputProps={{
                            inputProps: { min: 0 },
                        }}
                    />

                    {/* Experience */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Experience Level *</InputLabel>
                        <Select
                            value={formData.experience}
                            label="Experience Level *"
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        >
                            <MenuItem value="0-1 years">0-1 years</MenuItem>
                            <MenuItem value="1-3 years">1-3 years</MenuItem>
                            <MenuItem value="3-5 years">3-5 years</MenuItem>
                            <MenuItem value="5-10 years">5-10 years</MenuItem>
                            <MenuItem value="10+ years">10+ years</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Current Location */}
                    <TextField
                        fullWidth
                        label="Current Location *"
                        value={formData.currentLocation}
                        onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                        sx={{ mb: 3 }}
                        placeholder="e.g., New York, USA"
                    />

                    {/* Cover Letter (Optional) */}
                    <TextField
                        fullWidth
                        label="Cover Letter (Optional)"
                        multiline
                        rows={4}
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                        placeholder="Tell us why you're a great fit for this role..."
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            background: 'linear-gradient(135deg, #2FA4A9 0%, #5BC0BE 100%)',
                            px: 4,
                            boxShadow: '0 4px 12px rgba(47, 164, 169, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #258A8E 0%, #4AABAD 100%)',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit Application'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
