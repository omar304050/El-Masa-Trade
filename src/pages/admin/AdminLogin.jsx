import { Link } from "react-router-dom";
import AdminDesktopOnly from "../../admin/AdminDesktopOnly.jsx";

function AdminLogin() {
  function onSubmit(event) {
    event.preventDefault();
  }

  return (
    <AdminDesktopOnly>
    <section dir="rtl" className="grid min-h-screen place-items-center bg-[#f3f0ea] px-5 font-['Cairo'] text-[#1c1915]">
      <div className="w-full max-w-md rounded-3xl border border-[#e6dfd4] bg-white p-6 sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#d4893a]">MASA TRADE</p>
        <h1 className="mt-2 text-2xl font-bold">دخول الإدارة</h1>
        <p className="mt-2 text-sm leading-6 text-[#5c5348]">هذه الصفحة خاصة بفريق المتجر، ومنفصلة عن حسابات العملاء.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold">
            البريد الإلكتروني
            <input
              type="email"
              name="email"
              autoComplete="username"
              className="mt-2 h-12 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 text-sm outline-none focus:border-[#d4893a]"
            />
          </label>
          <label className="block text-sm font-bold">
            كلمة المرور
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              className="mt-2 h-12 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 text-sm outline-none focus:border-[#d4893a]"
            />
          </label>
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#273746] text-sm font-bold text-white transition hover:bg-[#98764e]"
          >
            دخول
          </button>
        </form>

        <Link to="/" className="mt-5 block text-center text-sm font-bold text-[#98764e]">
          العودة للمتجر
        </Link>
      </div>
    </section>
    </AdminDesktopOnly>
  );
}

export default AdminLogin;
