import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../../services/admin.service";
import Loader from "../../components/loader/loader.jsx";

function AdminGuard() {
    const { isLoading, isError } = useQuery({
        queryKey: ["adminAuth"],
        queryFn: getAdminDashboard,
        retry: false,
    });

    if (isLoading) return <Loader />;

    if (isError) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}

export default AdminGuard;
