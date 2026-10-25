import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clearCart, getCart } from "../../services/cart.service.js";
import { saveOrder } from "../../services/orders.service.js";
import Loader from "../../components/loader/loader.jsx";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";

const emptyForm = { name: "", phone: "", email: "", address: "" };

function money(value) {
  return Number(value || 0).toLocaleString("en-EG", { maximumFractionDigits: 1 });
}

function salePrice(product) {
  const price = Number(product?.price) || 0;
  const percentage = Number(product?.discount?.percentage) || 0;
  const hasDiscount = product?.discount?.isActive && percentage > 0;
  return hasDiscount ? price - (price * percentage) / 100 : price;
}

function latinDigits(value) {
  return value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/\s+/g, "");
}

function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const phone = latinDigits(form.phone);
  const email = form.email.trim();
  const address = form.address.trim();

  if (name.length < 3) errors.name = "اكتب الاسم ثلاثيًا على الأقل.";
  if (!/^01[0125]\d{8}$/.test(phone)) errors.phone = "اكتب رقم موبايل مصري مكوّن من 11 رقم.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "اكتب بريدًا إلكترونيًا صحيحًا.";
  if (address.length < 10) errors.address = "اكتب العنوان بالتفصيل: المحافظة والشارع.";

  return errors;
}

function CheckOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem("cartId");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(cartId),
    enabled: !!cartId,
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return <p className="p-10 text-center font-['Cairo']">حصل خطأ: {error.message}</p>;
  }

  const cart = data?.cart || data || {};
  const items = cart.items || cart.data || [];
  const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const lines = items.map((item) => {
    const product = item.product || item;
    const quantity = Number(item.quantity) || 1;
    const price = salePrice(product);
    const image = Array.isArray(product.images) ? product.images[0] : product.images;
    return {
      id: product._id || item._id,
      name: product.name,
      image,
      quantity,
      price,
    };
  });
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || pending) return;

    setPending(true);
    try {
      saveOrder({
        id: crypto.randomUUID(),
        number: String(Date.now()).slice(-6),
        createdAt: new Date().toISOString(),
        status: "review",
        customer: {
          name: form.name.trim(),
          phone: latinDigits(form.phone),
          email: form.email.trim(),
          address: form.address.trim(),
        },
        items: lines,
        total,
      });
      if (cartId) {
        try {
          await clearCart(cartId);
        } catch {
          toast.error("الطلب اتسجل، لكن السلة لسه موجودة.");
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم تأكيد الطلب");
      navigate("/allorders");
    } catch {
      toast.error("حصل خطأ أثناء تأكيد الطلب");
      setPending(false);
    }
  }

  return (
    <section dir="rtl" className="min-h-[calc(100svh-8.5rem)] font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <Breadcrumb
          items={[
            { label: "الرئيسية", to: "/" },
            { label: "السلة", to: "/cart" },
            { label: "إتمام الطلب" },
          ]}
        />

        <div className="mt-5">
          <h1 className="text-2xl font-bold text-[#252d35]">إتمام الطلب</h1>
          <p className="mt-1 text-sm text-[#837b70]">اكتب بيانات التوصيل عشان نأكد الطلب.</p>
        </div>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#e8e2d8] bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold text-[#252d35]">السلة فارغة</p>
            <p className="mt-2 text-sm text-[#837b70]">أضف منتجات قبل إتمام الطلب.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#273746] px-6 text-sm font-bold text-white"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
            <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-[#e8e2d8] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#252d35]">بيانات العميل</h2>
              <div className="mt-5 grid gap-4">
                <Field label="اسم العميل" error={errors.name} id="customer-name">
                  <input
                    id="customer-name"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    autoComplete="name"
                    placeholder="الاسم الثلاثي"
                    aria-invalid={Boolean(errors.name)}
                    className={`${inputClass(errors.name)} h-12`}
                  />
                </Field>
                <Field label="رقم التلفون" error={errors.phone} id="customer-phone">
                  <input
                    id="customer-phone"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    placeholder="01xxxxxxxxx"
                    aria-invalid={Boolean(errors.phone)}
                    className={`${inputClass(errors.phone)} h-12 text-right`}
                  />
                </Field>
                <Field label="البريد الإلكتروني" error={errors.email} id="customer-email">
                  <input
                    id="customer-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    autoComplete="email"
                    dir="ltr"
                    placeholder="name@email.com"
                    aria-invalid={Boolean(errors.email)}
                    className={`${inputClass(errors.email)} h-12 text-right`}
                  />
                </Field>
                <Field label="العنوان" error={errors.address} id="customer-address">
                  <textarea
                    id="customer-address"
                    value={form.address}
                    onChange={(event) => update("address", event.target.value)}
                    autoComplete="street-address"
                    rows={4}
                    placeholder="المحافظة، المدينة، والشارع"
                    aria-invalid={Boolean(errors.address)}
                    className={`${inputClass(errors.address)} min-h-28 py-3`}
                  />
                </Field>
              </div>
              <button
                type="submit"
                disabled={pending}
                className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#273746] text-sm font-bold text-white transition hover:bg-[#98764e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "جاري التأكيد" : "تأكيد الطلب"}
              </button>
            </form>

            <aside className="rounded-2xl border border-[#e8e2d8] bg-white p-5">
              <h2 className="text-lg font-bold text-[#252d35]">ملخص الطلب</h2>
              <ul className="mt-4 space-y-3">
                {lines.map((line) => (
                  <li key={line.id} className="flex items-center gap-3">
                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#f7f5f1] p-1.5">
                      <img src={line.image} alt="" className="max-h-full max-w-full object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{line.name}</span>
                      <span className="text-xs text-[#837b70]">الكمية {line.quantity}</span>
                    </span>
                    <span className="shrink-0 text-sm font-extrabold text-[#98764e]">
                      {money(line.price * line.quantity)} ج.م
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-3 border-y border-[#eee9e1] py-4 text-sm">
                <div className="flex justify-between text-[#837b70]">
                  <span>عدد المنتجات</span>
                  <span>{count}</span>
                </div>
                <div className="flex justify-between text-[#837b70]">
                  <span>الشحن</span>
                  <span>يُحسب لاحقاً</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-[#252d35]">الإجمالي</span>
                <span className="text-2xl font-extrabold text-[#98764e]">{money(total)} ج.م</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function inputClass(error) {
  return `w-full rounded-xl border bg-white px-4 text-sm outline-none transition placeholder:text-[#a39888] focus:ring-4 ${
    error
      ? "border-[#b4533a] focus:border-[#b4533a] focus:ring-[#b4533a]/15"
      : "border-[#e2d9cc] focus:border-[#d4893a] focus:ring-[#d4893a]/15"
  }`;
}

function Field({ label, error, id, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-bold text-[#252d35]">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-[#b4533a]">{error}</span>}
    </label>
  );
}

export default CheckOut;
