import { Link } from "react-router-dom";
import logo from "../assets/mainIcon.png";

const shopLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "المنتجات" },
  { to: "/categories", label: "الأقسام" },
  { to: "/brands", label: "الماركات" },
];

const accountLinks = [
  { to: "/login", label: "حسابي" },
  { to: "/cart", label: "السلة" },
  { to: "/checkout", label: "إتمام الطلب" },
  { to: "/allorders", label: "طلباتي" },
];

const departments = ["مواتر", "طلمبات", "قواطع وكونتاكتور", "كابلات", "إضاءة", "لوحات كهرباء"];

const promises = ["شحن لكل المحافظات", "ضمان على المواتير", "أسعار جملة للمقاولين"];

function Footer() {
  return (
    <footer dir="rtl" className="font-['Cairo'] text-[#f3eadc]">
      <div className="border-y border-[#e6dfd4] bg-[#fbf8f3] text-[#1c1915]">
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-3 text-xs font-semibold sm:px-6">
          {promises.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-[#d4893a]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#16130f]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#100e0c] p-1 shadow-[inset_0_0_0_1px_rgba(212,168,74,0.55)]">
                <img src={logo} alt="" className="size-full origin-center scale-[1.42] rounded-full object-cover" />
              </span>
              <span className="leading-none">
                <span className="block text-xl font-extrabold text-[#f6d7a8]">ماسة تريد</span>
                <span className="mt-1 block text-[10px] font-semibold tracking-[0.22em] text-[#cbbba4]">
                  MASA TRADE
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#d8cfc2]">
              توريد مواتير كهربائية وطلمبات مياه وجيربوكسات للمصانع والمقاولين. قطع أصلية، واختيار مبني على زمن التشغيل.
            </p>
          </div>

          <FooterColumn title="تسوق" className="lg:col-span-2">
            {shopLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition hover:text-[#f6d7a8]">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="الأقسام" className="lg:col-span-3">
            {departments.map((label) => (
              <li key={label}>
                <Link to="/categories" className="transition hover:text-[#f6d7a8]">
                  {label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="حسابك" className="lg:col-span-3">
            {accountLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition hover:text-[#f6d7a8]">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#100e0c]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-[#b7ab9c] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} ماسة تريد. كل الحقوق محفوظة.</p>
          <p>مواتر · طلمبات · جيربوكسات</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className = "", children }) {
  return (
    <div className={className}>
      <h2 className="text-sm font-bold text-[#f6d7a8]">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm text-[#d8cfc2]">{children}</ul>
    </div>
  );
}

export default Footer;
