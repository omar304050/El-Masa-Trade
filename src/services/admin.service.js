import axiosInstance from "../config/axios.config.js";

export const getAdminDashboard = async () => {
    const response = await axiosInstance.get("/api/admin/dashboard");
    return response.data;
}   

 export const adminLogin = async (email, password) => {
    const response = await axiosInstance.post("/api/admin/login", { email, password });
    return response.data;
}

export const AdminLogout = async () => {
    const response = await axiosInstance.post("/api/admin/logout");
    return response.data;
}