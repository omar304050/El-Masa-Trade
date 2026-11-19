import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminDesktopOnly from "./AdminDesktopOnly.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import { AdminLogout } from "../services/admin.service.js";
import { useMutation } from "@tanstack/react-query";
import { SidebarCollapseProvider } from "../context/sidebarCollapseContext.jsx";
import AdminContent from "./AdminLayoutContent.jsx";
const titles = {
  "/admin/admin-dashboard": "لوحة التحكم",
  "/admin/admin-products": "المنتجات",
  "/admin/admin-add-product": "إضافة منتج",
};

function AdminLayout() {
  const navigate = useNavigate();
  const { mutate: logout } = useMutation({ 
    mutationFn: AdminLogout,
    onSuccess: () => {
      navigate("/admin/login");
    },
  });
  const { pathname } = useLocation();
  const title = titles[pathname] || "الإدارة";

  return (
    <AdminDesktopOnly>
      <SidebarCollapseProvider>
        <div
          dir="rtl"
          className="min-h-screen bg-[#f3f0ea] font-['Cairo'] text-[#1c1915] "
        >
          <AdminSidebar />

        <AdminContent>
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-6 backdrop-blur-sm shadow-sm rounded-b-2xl">
              <h1
                className="text-xl font-semibold text-stone-800 tracking-tight cursor-pointer hover:text-stone-600 transition-colors"
                onClick={() => navigate("/admin/admin-dashboard")}
              >
                {title}
              </h1>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-[0.97]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                خروج
              </button>
            </header>

            <main
            dir="rtl" 
            className="px-6 py-6  ">
              <Outlet />
            </main>
        </AdminContent>

        </div>
      </SidebarCollapseProvider>
    </AdminDesktopOnly>
  );
}

export default AdminLayout;
