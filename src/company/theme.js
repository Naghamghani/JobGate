import { createTheme } from '@mui/material/styles';

const companyTheme = createTheme({
    palette: {
        primary: {
            main: '#2FA4A9', // Teal accent
            light: '#AEE3E6', // Soft cyan
            dark: '#258A8E',
        },
        secondary: {
            main: '#AEE3E6', // Soft cyan
            light: '#D4F1F3',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        success: {
            main: '#2FA4A9',
            light: '#AEE3E6',
        },
        warning: {
            main: '#f59e0b',
        },
        error: {
            main: '#ef4444',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            fontSize: '1.875rem',
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                },
            },
        },
    },
});

export default companyTheme;
