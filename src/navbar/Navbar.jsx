import { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import DiamondLogo from "../components/DiamondLogo/DiamondLogo.jsx";
import { useCart } from "../context/cartContext.jsx";
import { useProductContext } from "../context/ProductContext.jsx";

const links = [
  { to: "/", label: "الرئيسية", end: true },
  { to: "/products", label: "المنتجات" },
  // { to: "/categories", label: "الأقسام" },
  // { to: "/brands", label: "الماركات" },
  { to: "/allorders", label: "طلباتي" },
];

function Navbar() {
  const { cartData } = useCart();
  const { products } = useProductContext();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const departments = [...new Set((products?.data || []).map((product) => product.category).filter(Boolean))];
  const cartCount = cartData?.totalQuantity || 0;
  console.log("cartCount:", cartCount);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);

  function onSearch(event) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
    setMenuOpen(false);
  }

  function closeMenus() {
    setMenuOpen(false);  
    setDepartmentsOpen(false);
  }

  return (
    <header dir="rtl" className="sticky top-0 z-50 font-['Cairo'] text-[#1c1915]">
      <div className="bg-[#1c1915] text-[#f3eadc]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[12px] sm:px-6">
          <p className="flex min-w-0 items-center gap-2">
            <span className="inline-block size-1.5 shrink-0 rounded-full bg-[#d4893a]" />
            <span className="truncate sm:hidden">قطع غيار أصلية</span>
            <span className="hidden truncate sm:inline">قطع غيار أصلية للمواتر والأجهزة الكهربائية</span>
          </p>
          <ul className="hidden items-center gap-5 text-[#d8cfc2] md:flex">
            <li>شحن لكل المحافظات</li>
            <li className="h-3 w-px bg-white/15" />
            <li>ضمان على المواتير</li>
            <li className="h-3 w-px bg-white/15" />
            <li>أسعار جملة للمقاولين</li>
          </ul>
        </div>
      </div>

      <div className="border-b border-[#e6dfd4] bg-[#fbf8f3]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6">
          <NavLink to="/" onClick={closeMenus} className="flex shrink-0 items-center gap-1">
            <span className="grid size-11 shrink-0 -translate-y-[3px] place-items-center overflow-hidden">
              <DiamondLogo />
            </span>
            <span className="leading-none">
              <span className="block text-[18px] font-extrabold tracking-tight text-[#1c1915]">ماسة تريد</span>
              <span className="mt-1 block text-[10px] font-semibold tracking-[0.2em] text-[#8a7460]">
                MASA TRADE
              </span>
            </span>
          </NavLink>

          <form onSubmit={onSearch} className="hidden min-w-0 flex-1 md:block">
            <label className="relative block">
              <span className="sr-only">ابحث في المنتجات</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث بالموديل، رقم القطعة، أو اسم الجهاز"
                className="h-12 w-full rounded-full border border-[#e2d9cc] bg-white pe-28 ps-5 text-sm outline-none transition placeholder:text-[#a39888] focus:border-[#d4893a] focus:ring-4 focus:ring-[#d4893a]/15"
              />
              <button
                type="submit"
                className="absolute inset-e-1.5 top-1.5 h-9 rounded-full bg-[#1c1915] px-4 text-sm font-semibold text-[#f6d7a8] transition hover:bg-[#312c26]"
              >
                بحث
              </button>
            </label>
          </form>

          <div className="ms-auto flex items-center gap-2">
            <NavLink
              to="/login"
              onClick={closeMenus}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#3d362d] transition hover:bg-[#efe8dc] sm:flex"
            >
              <UserIcon />
              حسابي
            </NavLink>
            <NavLink
              to="/cart"
              onClick={closeMenus}
              className="relative flex items-center gap-2 rounded-full bg-[#1c1915] px-3.5 py-2.5 text-sm font-semibold text-[#f6d7a8] transition hover:bg-[#312c26]"
            >
              <CartIcon />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -inset-s-1.5 grid size-5 place-items-center rounded-full bg-[#d4893a] text-[11px] font-bold text-[#1c1915]">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-[#e2d9cc] md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      <nav className="hidden border-b border-[#e6dfd4] bg-white md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6">
          <div
            className="relative"
            onMouseEnter={() => setDepartmentsOpen(true)}
            onMouseLeave={() => setDepartmentsOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-2 bg-[#1c1915] px-4 py-3.5 text-sm font-semibold text-[#f6d7a8]"
              aria-expanded={departmentsOpen}
              onClick={() => setDepartmentsOpen((open) => !open)}
            >
              <MenuIcon />
              كل الأقسام
            </button>
            {departmentsOpen && (
              <div className="absolute inset-s-0 top-full z-20 w-72 border border-[#e6dfd4] bg-white p-2 shadow-[0_18px_40px_rgba(28,25,21,0.12)]">
                <NavLink
                  to="/products"
                  onClick={closeMenus}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition hover:bg-[#f7f1e7] ${
                    !selectedCategory ? "bg-[#f7f1e7] text-[#9a5b16]" : ""
                  }`}
                >
                  <span className="text-sm font-bold">الكل</span>
                  <span className="text-[#d4893a]">‹</span>
                </NavLink>
                {departments.map((item) => (
                  <NavLink
                    key={item}
                    to={`/products?category=${encodeURIComponent(item)}`}
                    onClick={closeMenus}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition hover:bg-[#f7f1e7] ${
                      selectedCategory === item ? "bg-[#f7f1e7] text-[#9a5b16]" : ""
                    }`}
                  >
                    <span className="text-sm font-bold">{item}</span>
                    <span className="text-[#d4893a]">‹</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-4 py-3.5 text-sm font-semibold transition ${
                  isActive
                    ? "text-[#9a5b16] shadow-[inset_0_-2px_0_#d4893a]"
                    : "text-[#3d362d] hover:text-[#9a5b16]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="border-b border-[#e6dfd4] bg-[#fbf8f3] px-4 py-4 md:hidden">
          <form onSubmit={onSearch}>
            <label className="block">
              <span className="sr-only">ابحث في المنتجات</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث بالموديل أو اسم الجهاز"
                className="h-11 w-full rounded-full border border-[#e2d9cc] bg-white px-4 text-sm outline-none focus:border-[#d4893a]"
              />
            </label>
          </form>
          <div className="mt-4 grid gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeMenus}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm font-bold ${
                    isActive ? "bg-[#1c1915] text-[#f6d7a8]" : "text-[#1c1915]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              onClick={closeMenus}
              className="rounded-xl px-3 py-3 text-sm font-bold text-[#1c1915] sm:hidden"
            >
              حسابي
            </NavLink>
          </div>
          <p className="mt-4 px-3 text-xs font-bold text-[#8a7d6b]">الأقسام</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {departments.map((item) => (
              <NavLink
                key={item}
                to={`/products?category=${encodeURIComponent(item)}`}
                onClick={closeMenus}
                className="rounded-xl border border-[#e6dfd4] bg-white px-3 py-3"
              >
                <span className="block text-sm font-bold">{item}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 19.2c1.4-2.8 3.8-4.2 7-4.2s5.6 1.4 7 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h2.2l1.4 9.2a1.5 1.5 0 0 0 1.5 1.3h8.4a1.5 1.5 0 0 0 1.5-1.2L20.5 8H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19.2" r="1.2" fill="currentColor" />
      <circle cx="17" cy="19.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default Navbar;
