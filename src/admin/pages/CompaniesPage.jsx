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
} from '@mui/material';
import StatCard from '../components/StatCard';
import { getAllCompanies } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getAllCompanies();
                setCompanies(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching companies:', error);
                toast.error('Failed to load companies');
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const getAvatarLetter = (name) => {
        return name?.substring(0, 2).toUpperCase() || 'CO';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
                Companies Management
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Companies" value={companies.length} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Active Companies" value={companies.length} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Pending Approval" value={0} />
                </Grid>
            </Grid>

            <Card sx={{ borderRadius: 3, border: '2px solid #AEE3E6' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#0f172a' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Company</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Location</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Joined Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : companies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No companies found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                companies.map((company) => (
                                    <TableRow
                                        key={company._id}
                                        sx={{
                                            '&:hover': { backgroundColor: '#f9fafb' },
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        backgroundColor: '#3b82f6',
                                                        width: 40,
                                                        height: 40,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {getAvatarLetter(company.name)}
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 500 }}>{company.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {company.category || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {company.location || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {company.email}
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {formatDate(company.createdAt)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <Button size="small" sx={{ textTransform: 'none', minWidth: 'auto' }}>
                                                    View
                                                </Button>
                                                <Button size="small" sx={{ textTransform: 'none', minWidth: 'auto' }}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    sx={{ textTransform: 'none', minWidth: 'auto', color: 'error.main' }}
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
        </Box>
    );
}
