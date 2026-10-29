import axiosInstance from "../config/axios.config.js";

export const getAdminDashboard = async () => {
    const response = await axiosInstance.get("/api/admin/dashboard");
    return response.data;
}   