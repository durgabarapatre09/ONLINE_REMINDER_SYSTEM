import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { loginSchema } from '../../schemas/authSchemas';
import { authService } from '../../services/authService';
import Toast from '../common/Toast';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    // Toast state
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            dispatch(loginStart());

            // Call the real login API
            const response = await authService.login({
                email: values.email,
                password: values.password,
            });



            console.log("login-response", response);
            const accessToken = response?.data?.tokens?.accessToken;
            // Store only the auth token in localStorage
            if (accessToken) {
                localStorage.setItem('authToken', accessToken);
            }
            // Fetch user details using the token
            let userData = [];
            // If we have a token, fetch complete user details
            if (accessToken) {
                try {
                    const userRes = await authService.getUserDetails();
                    userData = userRes?.data?.user;
                    console.log("user-details", userData);
                } catch (userError) {
                    console.error("Failed to fetch user details:", userError);
                    // Continue with the data from login response if user details fetch fails
                }
            }

            dispatch(loginSuccess(userData));
            // Show success message
            setToast({
                open: true,
                message: 'Login successful',
                severity: 'success'
            });

            // Navigate to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            let errorMessage = 'Login failed. Please try again.';

            // Handle different types of errors
            if (err.response) {
                // Server responded with error status
                if (err.response.status === 401) {
                    errorMessage = 'Invalid email or password.';
                } else if (err.response.status === 400) {
                    errorMessage = err.response.data?.message || 'Invalid input data.';
                } else if (err.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else {
                    errorMessage = err.response.data?.message || 'Login failed.';
                }
            } else if (err.request) {
                // Network error
                errorMessage = 'Network error. Please check your connection.';
            } else {
                // Other errors
                errorMessage = err.message || 'An unexpected error occurred.';
            }

            dispatch(loginFailure(errorMessage));

            // Show error toast
            setToast({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleToastClose = () => {
        setToast(prev => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#102aa8', mb: 3 }}>
                        Online Reminder System
                    </Typography>

                    <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
                        Login
                    </Typography>

                    {/* {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )} */}

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    margin="normal"
                                    error={errors.email && touched.email}
                                    helperText={errors.email && touched.email ? errors.email : ''}
                                    sx={{ mb: 2 }}
                                />

                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                    error={errors.password && touched.password}
                                    helperText={errors.password && touched.password ? errors.password : ''}
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isSubmitting || loading}
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
                                    {loading ? <CircularProgress size={24} /> : 'Login'}
                                </Button>

                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                        Don't have an account?{' '}
                                        <Link to="/signup" style={{ color: '#102aa8', textDecoration: 'none' }}>
                                            Sign up here
                                        </Link>
                                    </Typography>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>

            {/* Toast for success/error messages */}
            <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={handleToastClose}
            />
        </Container>
    );
};

export default Login;
