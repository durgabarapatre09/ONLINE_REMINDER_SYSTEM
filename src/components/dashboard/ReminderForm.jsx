import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { reminderSchema } from '../../schemas/reminderSchemas';
import { clearEditingReminder, createReminder, updateReminder } from '../../store/slices/reminderSlice';

const ReminderForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { editingReminder } = useSelector((state) => state.reminders);
  const isEditing = !!editingReminder;

  const initialValues = {
    title: editingReminder?.title || '',
    description: editingReminder?.description || '',
    scheduledAt: editingReminder?.scheduledAt ? dayjs(editingReminder.scheduledAt) : dayjs().add(1, 'hour'),
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const reminderData = {
      title: values.title,
      description: values.description,
      scheduledAt: values.scheduledAt.toISOString(),
    };

    if (isEditing) {
      dispatch(updateReminder({ ...reminderData, id: editingReminder.id }));
    } else {
      dispatch(createReminder(reminderData));
    }

    setSubmitting(false);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    dispatch(clearEditingReminder());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#102aa8', fontWeight: 'bold' }}>
        {isEditing ? 'Edit Reminder' : 'Add New Reminder'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={reminderSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                fullWidth
                name="title"
                label="Title"
                margin="normal"
                error={errors.title && touched.title}
                helperText={errors.title && touched.title ? errors.title : ''}
                sx={{ mb: 2 }}
              />

              <Field
                as={TextField}
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={3}
                margin="normal"
                error={errors.description && touched.description}
                helperText={errors.description && touched.description ? errors.description : ''}
                sx={{ mb: 2 }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date & Time"
                  value={values.scheduledAt}
                  onChange={(newValue) => setFieldValue('scheduledAt', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={errors.scheduledAt && touched.scheduledAt}
                      helperText={errors.scheduledAt && touched.scheduledAt ? errors.scheduledAt : ''}
                    />
                  )}
                  minDateTime={dayjs()}
                />
              </LocalizationProvider>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleClose}
                sx={{ color: '#808080' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
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
                {isEditing ? 'Update Reminder' : 'Add Reminder'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ReminderForm;