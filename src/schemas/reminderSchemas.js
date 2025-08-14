import * as Yup from 'yup';

// Reminder form validation schema
export const reminderSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .required('Title is required'),
    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .required('Description is required'),
    scheduledAt: Yup.date() // Fix: use scheduledAt instead of dateTime
        .min(new Date(), 'Date and time must be in the future')
        .required('Date and time is required'),
});

