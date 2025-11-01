import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Aquí puedes agregar interceptors para manejar errores o tokens en el futuro
// apiClient.interceptors.response.use(...)

export default apiClient;