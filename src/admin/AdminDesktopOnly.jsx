import { Link } from "react-router-dom";

function AdminDesktopOnly({ children }) {
  return (
    <>
      <div className="hidden lg:contents">{children}</div>
      <section dir="rtl" className="grid min-h-screen place-items-center bg-[#f3f0ea] px-6 font-['Cairo'] text-[#1c1915] lg:hidden">
        <div className="max-w-sm text-center">
          <p className="text-xs font-semibold text-[#d4893a]">ماسة تريد</p>
          <h1 className="mt-3 text-2xl font-bold">الإدارة على اللابتوب فقط</h1>
          <p className="mt-3 text-sm leading-7 text-[#5c5348]">
            لوحة التحكم غير متاحة على التلفون. افتحها من لابتوب لإدارة المتجر.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#273746] px-5 text-sm font-bold text-white"
          >
            العودة للمتجر
          </Link>
        </div>
      </section>
    </>
  );
}

export default AdminDesktopOnly;
