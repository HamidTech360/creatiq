/**
 * Maps Supabase/Postgres error codes to user-friendly messages.
 */
export const getErrorMessage = (error: any): string => {
    if (!error) return 'An unexpected error occurred';

    const code = error.code || error.status;
    const message = error.message || '';

    switch (code) {
        case '23505': // Unique constraint violation
            if (message.includes('profiles_pkey')) {
                return 'This profile already exists. Please try logging in instead.';
            }
            if (message.includes('email')) {
                return 'This email is already registered.';
            }
            return 'A record with this information already exists.';

        case '23503': // Foreign key violation
            return 'One of the references is invalid.';

        case '42P01': // Undefined table
            return 'System error: Table not found.';

        case 'PGRST116': // No rows found for .single()
            return 'The requested record was not found.';

        case 'auth/email-already-in-use':
            return 'This email is already in use by another account.';

        case 'auth/invalid-email':
            return 'Please enter a valid email address.';

        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';

        default:
            // Handle generic Supabase Auth errors which often come as message strings
            if (message.includes('User already registered')) {
                return 'An account with this email already exists.';
            }
            if (message.includes('Invalid login credentials')) {
                return 'Invalid email or password. Please try again.';
            }

            return message || 'An unexpected error occurred. Please try again.';
    }
};
