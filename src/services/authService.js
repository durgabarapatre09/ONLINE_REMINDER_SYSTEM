import api from './api';

export const authService = {
    // Signup with email
    signup: async (userData) => {
        try {
            const response = await api.post('/auth/register/email', {
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login with email
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login/email', {
                email: credentials.email,
                password: credentials.password,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get user details
    getUserDetails: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update profile
    updateProfile: async (profileData) => {
        try {
            const response = await api.patch('/auth/profile', {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
};