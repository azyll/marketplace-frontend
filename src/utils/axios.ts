import Axios from "axios";
import { CONFIG } from "../constants/config";

const axios = Axios.create({
  baseURL: CONFIG.BASE_URL,
});

axios.interceptors.request.use(
  (config) => {
    // Modify request config here

    const ACCESS_TOKEN = localStorage.getItem("accessToken");

    if (ACCESS_TOKEN) {
      config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    }

    return config;
  },

  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axios;
