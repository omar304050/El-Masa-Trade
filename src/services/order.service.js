import axiosInstance from "../config/axios.config.js";



export const createOrder = async (order) => {
    const response = await axiosInstance.post("/api/order", order);
    return response.data;
};

export const getOrders = async () => {
    const response = await axiosInstance.get("/api/order");
    return response.data;
}