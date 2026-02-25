import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
    baseURL: '', // Empty if proxying via Vite, or set to your API domain
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone) {
                config.headers['X-Timezone'] = timezone;
            }
        } catch (e) {
            // Ignore timezone error
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add response interceptor for global 401 handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle token expiration globally
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
