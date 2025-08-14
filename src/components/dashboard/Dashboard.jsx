import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountCircle,
  Logout,
  Person,
  Search as SearchIcon,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import {
  fetchReminders,
  deleteReminder,
  setEditingReminder,
  setFilters,
  clearError
} from '../../store/slices/reminderSlice';
import { hideToast } from '../../store/slices/toastSlice';
import ReminderForm from './ReminderForm';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import Toast from '../common/Toast';
import dayjs from 'dayjs';
import { authService } from '../../services/authService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    reminders,
    loading,
    error,
    pagination,
    filters
  } = useSelector((state) => state.reminders);
  const { open: toastOpen, message: toastMessage, severity: toastSeverity } = useSelector((state) => state.toast);

  console.log("reminders", pagination, reminders)
  const [anchorEl, setAnchorEl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    reminder: null,
  });

  // Fetch reminders on component mount and when filters change
  useEffect(() => {
    dispatch(fetchReminders({
      page: filters.currentPage, // Use filters.currentPage instead of pagination.currentPage
      limit: 5,
      search: filters.search,
      upcomingOnly: filters.upcomingOnly,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }));
  }, [dispatch, filters]); // Remove pagination.currentPage from dependencies

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Use authService logout to clear localStorage
    authService.logout();
    dispatch(logout());
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleAddReminder = () => {
    dispatch(setEditingReminder(null));
    setShowForm(true);
  };

  const handleEditReminder = (reminder) => {
    dispatch(setEditingReminder(reminder));
    setShowForm(true);
  };

  const handleDeleteClick = (reminder) => {
    setDeleteModal({
      open: true,
      reminder: reminder,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.reminder) {
      dispatch(deleteReminder(deleteModal.reminder.id));
    }
    setDeleteModal({ open: false, reminder: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, reminder: null });
  };

  const handleFormClose = () => {
    setShowForm(false);
    dispatch(setEditingReminder(null));
  };

  const handlePageChange = (event, newPage) => {
    console.log('Changing to page:', newPage); // Debug log
    dispatch(setFilters({ currentPage: newPage }));
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      const nextPage = pagination.currentPage + 1;
      console.log('Going to next page:', nextPage); // Debug log
      dispatch(setFilters({ currentPage: nextPage }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      const prevPage = pagination.currentPage - 1;
      console.log('Going to previous page:', prevPage); // Debug log
      dispatch(setFilters({ currentPage: prevPage }));
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    dispatch(setFilters({ search: searchTerm, currentPage: 1 }));
  };

  const handleSearchClick = () => {
    dispatch(setFilters({ search: searchTerm, currentPage: 1 }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(setFilters({ search: '', currentPage: 1 }));
  };

  const handleUpcomingOnlyChange = (event) => {
    dispatch(setFilters({
      upcomingOnly: event.target.checked,
      currentPage: 1
    }));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleToastClose = () => {
    dispatch(hideToast());
  };

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('MMM DD, YYYY h:mm A');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Toast Component */}
      <Toast
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleToastClose}
      />

      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#102aa8' }}>
            Online Reminder System
          </Typography>

          <IconButton
            onClick={handleAvatarClick}
            sx={{ color: 'white' }}
          >
            <Avatar sx={{ bgcolor: '#102aa8', color: 'white' }}>
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleUpdateProfile}>
              <Person sx={{ mr: 1 }} />
              Update Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#102aa8' }}>
            My Reminders
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddReminder}
            sx={{
              backgroundColor: '#f4af3d',
              color: '#171717',
              '&:hover': {
                backgroundColor: '#e69a2e',
              },
            }}
          >
            Add Reminder
          </Button>
        </Box>

        {/* Filters and Search */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flexGrow: 1, minWidth: 200, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearchClick}
                sx={{
                  backgroundColor: '#102aa8',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0a1f6b',
                  },
                }}
              >
                Search
              </Button>
              {searchTerm && (
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
                  sx={{
                    borderColor: '#102aa8',
                    color: '#102aa8',
                    '&:hover': {
                      borderColor: '#0a1f6b',
                      backgroundColor: 'rgba(16, 42, 168, 0.04)',
                    },
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.upcomingOnly}
                  onChange={handleUpcomingOnlyChange}
                  color="primary"
                />
              }
              label="Upcoming Only"
            />
          </Box>
        </Paper>

        {/* Error Alert */}
        {/* {error && (
          <Alert severity="error" onClose={handleClearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )} */}

        {/* Reminders Table */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#102aa8' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#102aa8' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#102aa8' }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#102aa8' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#102aa8' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : reminders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        {filters.search || filters.upcomingOnly
                          ? 'No reminders found matching your criteria.'
                          : 'No reminders found. Create your first reminder!'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reminders?.map((reminder) => {
                    const isPast = dayjs(reminder?.scheduledAt).isBefore(dayjs());
                    return (
                      <TableRow key={reminder.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{reminder.title}</TableCell>
                        <TableCell>{reminder.description}</TableCell>
                        <TableCell>{formatDateTime(reminder?.scheduledAt)}</TableCell>
                        <TableCell>
                          <Chip
                            label={isPast ? 'Past' : 'Upcoming'}
                            color={isPast ? 'error' : 'success'}
                            size="small"

                          />
                        </TableCell>
                        <TableCell>
                          {/* <IconButton
                            onClick={() => handleEditReminder(reminder)}
                            sx={{ color: '#102aa8', mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton> */}
                          <IconButton
                            onClick={() => handleDeleteClick(reminder)}
                            sx={{ color: '#ff5d3f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* Pagination Info */}
        {pagination.totalItems > 0 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Showing {((pagination.currentPage - 1) * 5) + 1} to{' '}
              {Math.min(pagination.currentPage * 5, pagination.totalItems)} of{' '}
              {pagination.totalItems} reminders
            </Typography>
          </Box>
        )}
      </Container>

      {/* Reminder Form Modal */}
      {showForm && (
        <ReminderForm
          open={showForm}
          onClose={handleFormClose}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.reminder?.title}
        message="This action cannot be undone. The reminder will be permanently deleted."
        loading={loading}
      />
    </Box>
  );
};

export default Dashboard;