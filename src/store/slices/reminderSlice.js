import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reminderService } from '../../services/reminderService';
import { showToast } from './toastSlice';

// Async thunk for fetching reminders
export const fetchReminders = createAsyncThunk(
  'reminders/fetchReminders',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // Get current state to access filters
      const state = getState();
      const currentPage = state.reminders.filters.currentPage || 1;

      const requestParams = {
        page: currentPage,
        limit: 5,
        search: params.search || state.reminders.filters.search || '',
        upcomingOnly: params.upcomingOnly || state.reminders.filters.upcomingOnly || false,
        sortBy: params.sortBy || state.reminders.filters.sortBy || 'createdAt',
        sortOrder: params.sortOrder || state.reminders.filters.sortOrder || 'desc',
      };

      console.log('Fetching reminders with params:', requestParams);
      const response = await reminderService.getReminders(requestParams);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reminders');
    }
  }
);

// Async thunk for creating reminder
export const createReminder = createAsyncThunk(
  'reminders/createReminder',
  async (reminderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await reminderService.createReminder(reminderData);

      // Show success toast
      dispatch(showToast({
        message: response.message || 'Reminder created successfully',
        severity: 'success'
      }));

      // Refresh the reminders list
      dispatch(fetchReminders());

      return response;
    } catch (error) {
      // Show error toast
      dispatch(showToast({
        message: error.response?.data?.message || 'Failed to create reminder',
        severity: 'error'
      }));
      return rejectWithValue(error.response?.data?.message || 'Failed to create reminder');
    }
  }
);

// Async thunk for updating reminder
export const updateReminder = createAsyncThunk(
  'reminders/updateReminder',
  async ({ id, ...reminderData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await reminderService.updateReminder(id, reminderData);

      // Show success toast
      dispatch(showToast({
        message: 'Reminder updated successfully',
        severity: 'success'
      }));

      // Refresh the reminders list
      dispatch(fetchReminders());

      return response;
    } catch (error) {
      // Show error toast
      dispatch(showToast({
        message: error.response?.data?.message || 'Failed to update reminder',
        severity: 'error'
      }));
      return rejectWithValue(error.response?.data?.message || 'Failed to update reminder');
    }
  }
);

// Async thunk for deleting reminder
export const deleteReminder = createAsyncThunk(
  'reminders/deleteReminder',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await reminderService.deleteReminder(id);

      // Show success toast
      dispatch(showToast({
        message: 'Reminder deleted successfully',
        severity: 'success'
      }));

      // Refresh the reminders list
      dispatch(fetchReminders());

      return id;
    } catch (error) {
      // Show error toast
      dispatch(showToast({
        message: error.response?.data?.message || 'Failed to delete reminder',
        severity: 'error'
      }));
      return rejectWithValue(error.response?.data?.message || 'Failed to delete reminder');
    }
  }
);

const initialState = {
  reminders: [],
  loading: false,
  error: null,
  editingReminder: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search: '',
    upcomingOnly: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    currentPage: 1, // Add currentPage to filters
  },
};

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setEditingReminder: (state, action) => {
      state.editingReminder = action.payload;
    },
    clearEditingReminder: (state) => {
      state.editingReminder = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      if (action.payload.currentPage) {
        state.pagination.currentPage = action.payload.currentPage;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reminders
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;

        // Handle different possible response structures
        const response = action.payload;
        console.log("API Response:", response, response?.data?.pagination); // Debug log

        // Set reminders data
        state.reminders = response?.data?.reminders || [];

        // Set pagination data from backend response
        if (response?.data?.pagination) {
          const paginationData = response.data.pagination;
          state.pagination = {
            currentPage: parseInt(paginationData.currentPage) || 1,
            totalPages: parseInt(paginationData.totalPages) || 1,
            totalItems: parseInt(paginationData.totalDocs) || 0,
            itemsPerPage: parseInt(paginationData.limit) || 5,
            hasNextPage: paginationData.hasNextPage || false,
            hasPrevPage: paginationData.hasPrevPage || false,
          };
          // Also update filters currentPage to keep them in sync
          state.filters.currentPage = state.pagination.currentPage;
        } else {
          // Default pagination if no pagination data is provided
          const totalItems = state.reminders.length;
          state.pagination = {
            currentPage: 1,
            totalPages: Math.ceil(totalItems / 5),
            totalItems: totalItems,
            itemsPerPage: 5,
            hasNextPage: false,
            hasPrevPage: false,
          };
        }
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create reminder
      .addCase(createReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.loading = false;
        // Don't manually add to state since we're refreshing the list
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update reminder
      .addCase(updateReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.loading = false;
        // Don't manually update state since we're refreshing the list
      })
      .addCase(updateReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete reminder
      .addCase(deleteReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.loading = false;
        // Don't manually remove from state since we're refreshing the list
      })
      .addCase(deleteReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setEditingReminder,
  clearEditingReminder,
  setFilters,
  clearError,
} = reminderSlice.actions;

export default reminderSlice.reducer;
