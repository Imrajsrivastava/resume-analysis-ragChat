import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;
const axiosInstance = axios.create({
    baseURL: API_BASE_URL, 
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request Interceptor:', config.method?.toUpperCase(), config.url, ' - Request sent');
        return config;
    },
    (error) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response Interceptor:', response.status, response.config.url, ' - Response received');
        return response;
    },
    (error) => {
        console.error('Response Interceptor Error:', error.response?.status, error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;   