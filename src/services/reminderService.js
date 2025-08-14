import api from './api';

export const reminderService = {
    // Get all reminders with pagination and filters
    getReminders: async (params = {}) => {
        try {
            const {
                page = 1,
                limit = 5, // Changed from 10 to 5
                sortBy = 'createdAt',
                sortOrder = 'desc',
                search = '',
                upcomingOnly = false
            } = params;

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                sortBy,
                sortOrder,
                ...(search && { search }),
                ...(upcomingOnly && { upcomingOnly: upcomingOnly.toString() })
            });

            console.log('API Call with params:', queryParams.toString()); // Debug log
            const response = await api.get(`/reminder?${queryParams}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new reminder
    createReminder: async (reminderData) => {
        try {
            const response = await api.post('/reminder', {
                title: reminderData.title,
                description: reminderData.description,
                scheduledAt: reminderData.scheduledAt, // Fix: use scheduledAt instead of dateTime
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update reminder
    updateReminder: async (id, reminderData) => {
        try {
            const response = await api.put(`/reminder/${id}`, { // Fix: use singular /reminder
                title: reminderData.title,
                description: reminderData.description,
                scheduledAt: reminderData.scheduledAt, // Fix: use scheduledAt instead of dateTime
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete reminder
    deleteReminder: async (id) => {
        try {
            const response = await api.delete(`/reminder/${id}`); // Fix: use singular /reminder
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};