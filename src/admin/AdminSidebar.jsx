import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/admin",
    label: "لوحة التحكم",
    end: true,
    icon: "M4 4.5h4.5V9H4V4.5Zm7.5 0H16V9h-4.5V4.5ZM4 12h4.5v4.5H4V12Zm7.5 0H16v4.5h-4.5V12Z",
  },
  {
    to: "/admin/products",
    label: "المنتجات",
    icon: "M4 7.5h12v9.2a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 16.7V7.5Zm0 0 1.6-2.2h8.8L16 7.5M8 11.2h4",
  },
];

function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-64 flex-col border-l border-[#e6dfd4] bg-[#fbf8f3] text-[#1c1915]">
      <div className="border-b border-[#e6dfd4] px-5 py-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#d4a84a]">MASA TRADE</p>
        <p className="mt-1 text-lg font-bold">إدارة المتجر</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                isActive ? "bg-[#273746] text-white" : "text-[#5c5348] hover:bg-white hover:text-[#1c1915]"
              }`
            }
          >
            <svg viewBox="0 0 20 20" className="size-5 shrink-0" fill="none" aria-hidden="true">
              <path d={link.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#e6dfd4] p-3">
        <NavLink
          to="/"
          className="flex items-center rounded-xl px-3 py-2.5 text-sm font-bold text-[#5c5348] transition hover:bg-white hover:text-[#1c1915]"
        >
          العودة للمتجر
        </NavLink>
      </div>
    </aside>
  );
}

export default AdminSidebar;
