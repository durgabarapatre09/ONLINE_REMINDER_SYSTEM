import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { updateProfile } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { profileSchema } from '../../schemas/authSchemas';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      // Call the API to update profile
      const response = await authService.updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
      });
      console.log("response", response)
      // Update Redux store with the new user data
      dispatch(updateProfile({
        firstName: response.data?.firstName || values.firstName,
        lastName: response.data?.lastName || values.lastName,
      }));

      setSuccess('Profile updated successfully!');

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading if user data is not available
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Update Profile
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
              Update Your Profile
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Formik
              initialValues={{
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
              }}
              validationSchema={profileSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    name="firstName"
                    label="First Name"
                    margin="normal"
                    error={errors.firstName && touched.firstName}
                    helperText={errors.firstName && touched.firstName ? errors.firstName : ''}
                    sx={{ mb: 2 }}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    margin="normal"
                    error={errors.lastName && touched.lastName}
                    helperText={errors.lastName && touched.lastName ? errors.lastName : ''}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#f4af3d',
                      color: '#171717',
                      '&:hover': {
                        backgroundColor: '#e69a2e',
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                      },
                    }}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateProfile;