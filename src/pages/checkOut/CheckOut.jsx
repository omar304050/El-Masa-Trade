
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createOrder } from "../../services/order.service.js";
import Loader from "../../components/loader/loader.jsx";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import { useCart } from "../../context/cartContext.jsx";

function CheckOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem("cartId");

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });

  const { cartData, isLoading, isError } = useCart();

  const cart = cartData?.cart || cartData || {};
  const items = cart.items || [];
  const total = cartData?.totalPrice ?? 0;

  const orderMutation = useMutation({
    mutationFn: () =>
      createOrder({
        cartId,
        ...form,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم تأكيد الطلب بنجاح");
      navigate("/allorders");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "حصل خطأ أثناء تأكيد الطلب"
      );
    },
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.customerName.trim() ||
      !form.customerPhone.trim() ||
      !form.customerAddress.trim()
    ) {
      toast.error("من فضلك املأ كل البيانات");
      return;
    }

    if (!/^01[0125]\d{8}$/.test(form.customerPhone.trim())) {
      toast.error("اكتب رقم موبايل مصري صحيح");
      return;
    }

    if (!items.length) {
      toast.error("السلة فارغة");
      return;
    }

    orderMutation.mutate();
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <p className="p-8 text-center">
        حصل خطأ أثناء تحميل السلة
      </p>
    );
  }

  return (
    <section
      dir="rtl"
      className="mx-auto max-w-5xl p-5 font-['Cairo']"
    >
      <Breadcrumb
        items={[
          { label: "الرئيسية", to: "/" },
          { label: "السلة", to: "/cart" },
          { label: "إتمام الطلب" },
        ]}
      />

      <h1 className="my-6 text-2xl font-bold">إتمام الطلب</h1>

      {!items.length ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-bold">السلة فارغة</p>

          <Link
            to="/products"
            className="mt-4 inline-block text-blue-700"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border p-5"
          >
            <h2 className="text-lg font-bold">بيانات العميل</h2>

            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="اسم العميل"
              autoComplete="name"
              className="w-full rounded-lg border p-3"
            />

            <input
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              placeholder="رقم التليفون"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              className="w-full rounded-lg border p-3"
            />

            <textarea
              name="customerAddress"
              value={form.customerAddress}
              onChange={handleChange}
              placeholder="المحافظة، المدينة، والشارع"
              autoComplete="street-address"
              rows={4}
              className="w-full rounded-lg border p-3"
            />

            <button
              type="submit"
              disabled={orderMutation.isPending}
              className="w-full rounded-lg bg-[#273746] p-3 font-bold text-white disabled:opacity-60"
            >
              {orderMutation.isPending
                ? "جاري تأكيد الطلب..."
                : "تأكيد الطلب"}
            </button>
          </form>

          <aside className="h-fit rounded-xl border p-5">
            <h2 className="mb-4 text-lg font-bold">ملخص الطلب</h2>

            <div className="space-y-3">
              {items.map((item, index) => {
                const product = item.product || item;
                const finalPrice = item.finalPrice;

                return (
                  <div
                    key={product._id || index}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span>
                      {product.name} × {item.quantity}
                    </span>

                    <span>
                      {(
                        finalPrice * item.quantity
                      ).toLocaleString("en-EG")}{" "}
                      ج.م
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-between border-t pt-4 font-bold">
              <span>الإجمالي</span>

              <span>
                {total.toLocaleString("en-EG")} ج.م
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              تكلفة الشحن تُحدد لاحقًا.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CheckOut;
