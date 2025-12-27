import React from 'react';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Box,
} from '@mui/material';

const users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        status: 'Verified',
        dateJoined: '2023-01-15',
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'john.doe@example.com',
        status: 'Verified',
        dateJoined: '2023-01-15',
    },
    {
        id: 3,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        status: 'Unverified',
        dateJoined: '2024-03-20',
    },
    {
        id: 4,
        name: 'Unverified',
        email: 'john.doe@example.com',
        status: 'Unverified',
        dateJoined: '2024-03-20',
    },
];

export default function UsersTable() {
    return (
        <Card sx={{ borderRadius: 3, border: '2px solid #dbeafe' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#0f172a' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Profile Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date Joined</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    '&:hover': { backgroundColor: '#f9fafb' },
                                }}
                            >
                                <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        size="small"
                                        sx={{
                                            backgroundColor: user.status === 'Verified' ? '#d1fae5' : '#fed7aa',
                                            color: user.status === 'Verified' ? '#065f46' : '#92400e',
                                            fontWeight: 500,
                                            borderRadius: 2,
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{user.dateJoined}</TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button size="small" sx={{ textTransform: 'none', minWidth: 'auto' }}>
                                            View
                                        </Button>
                                        <Button size="small" sx={{ textTransform: 'none', minWidth: 'auto' }}>
                                            Edit
                                        </Button>
                                        <Button size="small" sx={{ textTransform: 'none', minWidth: 'auto', color: 'error.main' }}>
                                            Suspend
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}
