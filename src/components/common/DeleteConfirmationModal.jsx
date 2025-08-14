import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, title, message, loading = false }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1, color: '#d32f2f' }} />
                Confirm Delete
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Are you sure you want to delete this reminder?
                </Typography>
                {title && (
                    <Box sx={{
                        backgroundColor: '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                        mt: 2
                    }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#102aa8' }}>
                            Reminder Title:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {title}
                        </Typography>
                    </Box>
                )}
                {message && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {message}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    sx={{ color: '#808080' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#b71c1c',
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc',
                        },
                    }}
                >
                    {loading ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationModal;
