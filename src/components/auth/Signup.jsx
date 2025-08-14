import React from 'react';
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
    CircularProgress
} from '@mui/material';
import { signupSchema } from '../../schemas/authSchemas';
import { authService } from '../../services/authService';
import Toast from '../common/Toast';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [toast, setToast] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setLoading(true);

            // Call the signup API
            const response = await authService.signup({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
            });

            // Show success message
            setToast({
                open: true,
                message: 'Account created successfully! Please login with your credentials.',
                severity: 'success'
            });

            // Reset form
            resetForm();

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            // Handle different types of errors
            let errorMessage = error?.message || 'Failed to create account. Please try again.';
            console.log("error", error?.message);
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 409) {
                errorMessage = 'Email already exists. Please use a different email.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid data provided. Please check your information.';
            }

            setToast({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleCloseToast = () => {
        setToast(prev => ({ ...prev, open: false }));
    };

    return (
        <>
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
                            Sign Up
                        </Typography>

                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
                                password: '',
                                confirmPassword: ''
                            }}
                            validationSchema={signupSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="firstName"
                                            label="First Name"
                                            error={errors.firstName && touched.firstName}
                                            helperText={errors.firstName && touched.firstName ? errors.firstName : ''}
                                        />
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="lastName"
                                            label="Last Name"
                                            error={errors.lastName && touched.lastName}
                                            helperText={errors.lastName && touched.lastName ? errors.lastName : ''}
                                        />
                                    </Box>

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
                                        sx={{ mb: 2 }}
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        margin="normal"
                                        error={errors.confirmPassword && touched.confirmPassword}
                                        helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
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
                                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                                    </Button>

                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Typography variant="body2">
                                            Already have an account?{' '}
                                            <Link to="/login" style={{ color: '#102aa8', textDecoration: 'none' }}>
                                                Login here
                                            </Link>
                                        </Typography>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                </Box>
            </Container>

            {/* Toast Notification */}
            <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={handleCloseToast}
            />
        </>
    );
};

export default Signup;