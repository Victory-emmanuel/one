// Auth-related constants
export const ADMIN_API_ACCESS_KEY = 'admin_api_access_granted';

// Function to get the admin session key for a specific user
export const getAdminSessionKey = (userId: string) => `${ADMIN_API_ACCESS_KEY}_${userId}`;
