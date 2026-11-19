import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSidebarCollapse } from "../context/sidebarCollapseContext.jsx";


const links = [
  {
    to: "/admin/admin-dashboard",
    label: "لوحة التحكم",
    end: true,
    icon: "M4 4.5h4.5V9H4V4.5Zm7.5 0H16V9h-4.5V4.5ZM4 12h4.5v4.5H4V12Zm7.5 0H16v4.5h-4.5V12Z",
  },
  {
    to: "/admin/admin-products",
    label: "المنتجات",
    icon: "M4 7.5h12v9.2a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 16.7V7.5Zm0 0 1.6-2.2h8.8L16 7.5M8 11.2h4",
  },
  {
    to: "/admin/admin-add-product",
    label: "إضافة منتج",
    icon: "M10 4.5v11M4.5 10h11",
  },
];

function AdminSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebarCollapse();

  console.log(isCollapsed);
  

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 flex flex-col border-l border-[#e6dfd4] bg-[#fbf8f3] text-[#1c1915] transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[250px] "
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e6dfd4] px-4 py-5">
        {!isCollapsed && (
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#d4a84a]">
              MASA TRADE
            </p>
            <p className="mt-1 text-lg font-bold">إدارة المتجر</p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-xl p-2 text-[#5c5348] transition hover:bg-white hover:text-[#1c1915]"
          title={isCollapsed ? "توسيع" : "طي"}
        >
          <svg
            viewBox="0 0 20 20"
            className={`size-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            fill="none"
          >
            <path
              d="M12.5 5L7.5 10L12.5 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                isActive
                  ? "bg-[#273746] text-white"
                  : "text-[#5c5348] hover:bg-white hover:text-[#1c1915]"
              } ${isCollapsed ? "justify-center" : ""}`
            }
            title={isCollapsed ? link.label : undefined}
          >
            <svg
              viewBox="0 0 20 20"
              className="size-5 shrink-0"
              fill="none"
              aria-hidden="true"
            >
              <path
                d={link.icon}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {!isCollapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#e6dfd4] p-3">
        <NavLink
          to="/"
          className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-bold text-[#5c5348] transition hover:bg-white hover:text-[#1c1915] ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
          title={isCollapsed ? "العودة للمتجر" : undefined}
        >
          <svg
            viewBox="0 0 20 20"
            className="size-5 shrink-0"
            fill="none"
          >
            <path
              d="M3 10h11M9 5l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {!isCollapsed && <span>العودة للمتجر</span>}
        </NavLink>
      </div>
    </aside>
  );
}

export default AdminSidebar;