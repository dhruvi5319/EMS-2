import axios from 'axios';

/**
 * Axios client pre-configured for the EMS backend API.
 *
 * - Sends cookies (credentials: 'include') so httpOnly auth cookies are
 *   forwarded automatically.
 * - On 401 responses, redirects to /login so protected pages don't
 *   silently show stale data.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — redirect to login on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Avoid redirect loops when already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
