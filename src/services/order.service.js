import axiosInstance from "../config/axios.config.js";



export const createOrder = async (order) => {
    const response = await axiosInstance.post("/api/orders", order);
    return response.data;
};