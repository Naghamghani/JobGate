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
    TextField,
    MenuItem,
} from '@mui/material';
import StatCard from '../components/StatCard';
import { getAllUsersAPI, getUserById, updateUserById, deleteUserById } from '../../api/AuthAPI';
import { toast } from 'react-toastify';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsersAPI();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setLoading(false);
        }
    };

    const handleViewUser = async (userId) => {
        try {
            const user = await getUserById(userId);
            setSelectedUser(user);
            setViewDialogOpen(true);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to load user details');
        }
    };

    const handleEditUser = async (userId) => {
        try {
            const user = await getUserById(userId);
            setSelectedUser(user);
            setEditFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                headline: user.headline || '',
                location: user.location || '',
                category: user.category || '',
                about: user.about || '',
            });
            setEditDialogOpen(true);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to load user details');
        }
    };

    const handleSaveEdit = async () => {
        try {
            await updateUserById(selectedUser._id, editFormData);
            toast.success('User updated successfully');
            setEditDialogOpen(false);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            try {
                await deleteUserById(userId);
                toast.success('User deleted successfully');
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const getAvatarLetter = (name) => {
        return name?.charAt(0).toUpperCase() || 'U';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return { bg: '#fee2e2', color: '#991b1b' };
            case 'company':
                return { bg: '#AEE3E6', color: '#2FA4A9' };
            case 'candidate':
                return { bg: '#d1fae5', color: '#065f46' };
            default:
                return { bg: '#e5e7eb', color: '#374151' };
        }
    };

    const candidates = users.filter(u => u.role === 'candidate');
    const companies = users.filter(u => u.role === 'company');
    const admins = users.filter(u => u.role === 'admin');

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
                User Management
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <StatCard title="Total Users" value={users.length} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Candidates" value={candidates.length} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Companies" value={companies.length} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard title="Admins" value={admins.length} />
                </Grid>
            </Grid>

            <Card sx={{ borderRadius: 3, border: '2px solid #AEE3E6' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#0f172a' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>User</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>User ID</TableCell>
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
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No users found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => {
                                    const roleColors = getRoleColor(user.role);
                                    return (
                                        <TableRow
                                            key={user._id}
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
                                                        {getAvatarLetter(user.name)}
                                                    </Avatar>
                                                    <Typography sx={{ fontWeight: 500 }}>{user.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: roleColors.bg,
                                                        color: roleColors.color,
                                                        fontWeight: 500,
                                                        borderRadius: 2,
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>
                                                {user.userID || 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>
                                                {formatDate(user.createdAt)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        size="small"
                                                        sx={{ textTransform: 'none', minWidth: 'auto' }}
                                                        onClick={() => handleViewUser(user._id)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        sx={{ textTransform: 'none', minWidth: 'auto' }}
                                                        onClick={() => handleEditUser(user._id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        sx={{ textTransform: 'none', minWidth: 'auto', color: 'error.main' }}
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                    >
                                                        Delete
                                                    </Button>
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

            {/* View User Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                    <Typography variant="body1">{selectedUser.name}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1">{selectedUser.email}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{selectedUser.role}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                                    <Typography variant="body1">{selectedUser.userID}</Typography>
                                </Grid>
                                {selectedUser.headline && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Headline</Typography>
                                        <Typography variant="body1">{selectedUser.headline}</Typography>
                                    </Grid>
                                )}
                                {selectedUser.location && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                                        <Typography variant="body1">{selectedUser.location}</Typography>
                                    </Grid>
                                )}
                                {selectedUser.category && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                                        <Typography variant="body1">{selectedUser.category}</Typography>
                                    </Grid>
                                )}
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Joined</Typography>
                                    <Typography variant="body1">{formatDate(selectedUser.createdAt)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                                    <Typography variant="body1">{formatDate(selectedUser.updatedAt)}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={editFormData.name || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={editFormData.email || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Role"
                                    value={editFormData.role || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                >
                                    <MenuItem value="candidate">Candidate</MenuItem>
                                    <MenuItem value="company">Company</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Headline"
                                    value={editFormData.headline || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, headline: e.target.value })}
                                />
                            </Grid>
                            {editFormData.role === 'company' && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Location"
                                            value={editFormData.location || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Category"
                                            value={editFormData.category || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="About"
                                            multiline
                                            rows={3}
                                            value={editFormData.about || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, about: e.target.value })}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
