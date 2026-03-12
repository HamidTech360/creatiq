import * as yup from 'yup';

export const loginValidator = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const signupValidator = yup.object().shape({
    full_name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    whatsapp_number: yup.string().optional(),
    niche: yup.string().required('Please select a niche'),
    selected_platforms: yup.array().min(1, 'Select at least one platform').required('Platforms are required'),
});

export const onboardingValidator = yup.object().shape({
    brand_voice: yup.string().required('Please select a brand voice'),
    posting_frequency: yup.string().required('Please select your frequency'),
    whatsapp_enabled: yup.boolean(),
    delivery_time: yup.string().when('whatsapp_enabled', {
        is: true,
        then: (schema) => schema.required('Select a delivery time'),
        otherwise: (schema) => schema.optional(),
    }),
});
