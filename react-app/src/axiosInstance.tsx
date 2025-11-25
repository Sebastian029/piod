import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"]=`Bearer {token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401){
            //Refresh token
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;