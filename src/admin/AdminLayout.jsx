import { Outlet, useLocation } from "react-router-dom";
import AdminDesktopOnly from "./AdminDesktopOnly.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

const titles = {
  "/admin": "لوحة التحكم",
  "/admin/products": "المنتجات",
};

function AdminLayout() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "الإدارة";

  return (
    <AdminDesktopOnly>
      <div dir="rtl" className="min-h-screen bg-[#f3f0ea] font-['Cairo'] text-[#1c1915]">
        <AdminSidebar />

        <div className="pr-64">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#e6dfd4] bg-white px-6">
            <h1 className="text-lg font-bold">{title}</h1>
            <p className="text-xs font-semibold text-[#6d6256]">حساب المدير</p>
          </header>

          <main className="px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminDesktopOnly>
  );
}

export default AdminLayout;
