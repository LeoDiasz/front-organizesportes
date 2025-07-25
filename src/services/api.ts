import axios from "axios";

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30 * 1000
})


request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;