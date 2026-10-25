import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/orders.service.js";

const statuses = {
  review: { label: "قيد المراجعة", tone: "bg-[#f6efe4] text-[#8a7460]" },
  preparing: { label: "جاري التجهيز", tone: "bg-[#f8f1e4] text-[#9a6b2f]" },
  shipped: { label: "في الطريق", tone: "bg-[#eef3f8] text-[#1e3a5f]" },
  delivered: { label: "تم التسليم", tone: "bg-[#eef6f1] text-[#2f6b45]" },
  cancelled: { label: "ملغي", tone: "bg-[#f8eee9] text-[#8a4b3c]" },
};

const filters = [
  { id: "all", label: "الكل" },
  { id: "review", label: "قيد المراجعة" },
  { id: "preparing", label: "جاري التجهيز" },
  { id: "shipped", label: "في الطريق" },
  { id: "delivered", label: "تم التسليم" },
];

const steps = [
  { title: "اختيار المعدات", text: "مواتير وطلمبات وجيربوكسات من المنتجات." },
  { title: "تأكيد الطلب", text: "من السلة، مع عنوان التوصيل." },
  { title: "تجهيز الشحنة", text: "نراجع القطع ونجهزها للشحن." },
  { title: "التوصيل", text: "الشحنة توصل إلى محافظتك." },
];

function money(value) {
  return Number(value || 0).toLocaleString("en-EG", { maximumFractionDigits: 1 });
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
}

function shortNumber(order) {
  const raw = String(order.number || order.id || "");
  const compact = raw.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return compact || "000000";
}

function lineItems(order) {
  const source = Array.isArray(order.items) ? order.items : [];
  return source.map((item, index) => {
    const product = item.product || item;
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price ?? product.price) || 0;
    const image = Array.isArray(product.images) ? product.images[0] : product.image || product.images;
    return {
      id: product._id || item._id || `${index}`,
      name: product.name || "منتج",
      image,
      quantity,
      price,
    };
  });
}

function normalize(order, index) {
  const items = lineItems(order);
  const computed = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const status = statuses[order.status] ? order.status : "review";
  return {
    id: String(order._id || order.id || order.number || index),
    number: shortNumber(order),
    createdAt: order.createdAt || order.date || "",
    status,
    governorate: order.governorate || order.city || "",
    customer: order.customer || null,
    items,
    total: Number(order.total ?? computed) || 0,
  };
}

function Orders() {
  const [orders] = useState(() => getOrders().map(normalize));
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const visible = useMemo(
    () => orders.filter((order) => filter === "all" || order.status === filter),
    [orders, filter]
  );

  const activeCount = orders.filter((order) => order.status === "review" || order.status === "preparing" || order.status === "shipped").length;
  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <section dir="rtl" className="font-['Cairo'] text-[#1c1915]">
      <div className="relative overflow-hidden bg-[#100e0c] text-[#f8f1e6]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,74,0.2),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-[#d4a84a] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-[#cbbba4]">
            <Link to="/" className="transition hover:text-[#f0d7a4]">الرئيسية</Link>
            <span className="text-[#d4a84a]/70">/</span>
            <span className="font-semibold text-[#f8f1e6]">طلباتي</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#d4a84a]">متابعة التوريد</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">طلباتي</h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[#d8cfc2]">
                حالة كل طلب من المراجعة حتى التسليم، مع التوصيل إلى محافظتك.
              </p>
            </div>
          </div>
          {orders.length > 0 && (
            <ul className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#d4a84a]/25">
              <Stat label="الطلبات" value={orders.length} />
              <Stat label="قيد التنفيذ" value={activeCount} />
              <Stat label="إجمالي المشتريات" value={`${money(totalSpent)} ج.م`} />
            </ul>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                      active
                        ? "bg-[#273746] text-white"
                        : "border border-[#e6dfd4] bg-white text-[#5c5348] hover:border-[#d4a84a]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {visible.length === 0 ? (
              <p className="mt-8 rounded-3xl border border-[#e6dfd4] bg-white px-6 py-14 text-center text-sm font-semibold text-[#6d6256]">
                لا توجد طلبات في هذه الحالة.
              </p>
            ) : (
              <ul className="mt-5 space-y-4">
                {visible.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    open={openId === order.id}
                    onToggle={() => setOpenId((current) => (current === order.id ? null : order.id))}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <li className="border-s border-[#d4a84a]/20 px-3 py-4 text-center first:border-s-0 sm:px-6 sm:text-right">
      <p className="text-[11px] text-[#cbbba4] sm:text-xs">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#f0d7a4] sm:text-2xl">{value}</p>
    </li>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-3xl border border-[#e6dfd4] bg-white px-5 py-10 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-[#d4a84a]/50 bg-[#fbf8f3] text-[#9a6b2f]">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden="true">
            <path d="M4 7.5h16v11.2a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.7V7.5Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 7.5 6.2 4.8h11.6L20 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9.5 12.2h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl font-bold">لا توجد طلبات بعد</h2>
        <p className="mt-2 text-sm leading-7 text-[#6d6256]">
          بعد تأكيد الطلب من السلة، يظهر هنا رقمه وحالته ووجهة الشحن إلى أي محافظة.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#273746] px-6 text-sm font-bold text-white transition hover:bg-[#98764e]"
          >
            تصفح المنتجات
          </Link>
          <Link
            to="/cart"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-6 text-sm font-bold text-[#5c5348] transition hover:border-[#d4a84a]"
          >
            السلة
          </Link>
        </div>
      </div>

      <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 py-4">
            <span className="text-xs font-bold tracking-wide text-[#d4893a]">0{index + 1}</span>
            <p className="mt-2 text-sm font-bold">{step.title}</p>
            <p className="mt-1 text-xs leading-6 text-[#6d6256]">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OrderCard({ order, open, onToggle }) {
  const status = statuses[order.status];
  const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const date = formatDate(order.createdAt);

  return (
    <li className="overflow-hidden rounded-3xl border border-[#e6dfd4] bg-white">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={open}
        className="w-full cursor-pointer text-right"
      >
        <span className="flex items-start justify-between gap-4 px-5 py-4">
          <span>
            <span className="block text-xs font-bold text-[#9a6b2f]">طلب #{order.number}</span>
            <span className="mt-1 block text-sm text-[#6d6256]">
              {[date, order.governorate].filter(Boolean).join(" · ") || "بانتظار التفاصيل"}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.tone}`}>{status.label}</span>
            <svg viewBox="0 0 20 20" className={`size-4 text-[#8a7460] transition ${open ? "rotate-180" : ""}`} fill="none" aria-hidden="true">
              <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>

      <span className="flex items-center justify-between gap-4 border-t border-[#eee9e1] px-5 py-4">
        <span className="flex min-w-0 gap-2">
          {order.items.slice(0, 3).map((item) => (
            <span key={item.id} className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#f7f5f1] p-1.5">
              {item.image ? (
                <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="size-2 rounded-full bg-[#d4a84a]" />
              )}
            </span>
          ))}
          {order.items.length > 3 && (
            <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#fbf8f3] text-xs font-bold text-[#8a7460]">
              +{order.items.length - 3}
            </span>
          )}
        </span>
        <span className="text-left">
          <span className="block text-xs text-[#837b70]">{count} قطعة</span>
          <span className="block text-lg font-extrabold text-[#98764e]">{money(order.total)} ج.م</span>
        </span>
      </span>
      </div>

      {open && (
        <div className="border-t border-[#eee9e1] bg-[#fbf8f3] px-5 py-4">
          {order.customer && (
            <div className="mb-4 text-sm leading-6 text-[#6d6256]">
              <p className="font-bold text-[#252d35]">{order.customer.name}</p>
              <p>{order.customer.phone}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.address}</p>
            </div>
          )}
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-bold text-[#252d35]">{item.name}</span>
                <span className="text-[#837b70]">الكمية {item.quantity}</span>
              </span>
              <span className="shrink-0 font-bold text-[#98764e]">{money(item.price * item.quantity)} ج.م</span>
            </li>
          ))}
        </ul>
        </div>
      )}
    </li>
  );
}

export default Orders;
