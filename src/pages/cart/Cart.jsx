import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearCart, loadCart, removeFromCart , getCart , createCart } from "../../services/cart.service";
import Loader from "../../components/loader/loader.jsx";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import { useEffect } from "react";

function money(value) {
  return Number(value || 0).toLocaleString("en-EG", { maximumFractionDigits: 1 });
}

function salePrice(product) {
  const price = Number(product?.price) || 0;
  const percentage = Number(product?.discount?.percentage) || 0;
  const hasDiscount = product?.discount?.isActive && percentage > 0;
  return hasDiscount ? price - (price * percentage) / 100 : price;
}

function Cart() {
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem("cartId");
  console.log("cartId:", cartId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(cartId),
    enabled: !!cartId 
  });



  const removeItem = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const emptyCart = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return <p className="p-10 text-center font-['Cairo']">حصل خطأ: {error.message}</p>;
  }

  const cart = data?.cart || data || {};
  const items = cart.items || cart.data || [];
  const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const total = items.reduce((sum, item) => {
    const product = item.product || item;
    return sum + salePrice(product) * (Number(item.quantity) || 1);
  }, 0);

  return (
    <section dir="rtl" className="min-h-[calc(100svh-8.5rem)] font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <Breadcrumb
          items={[
            { label: "الرئيسية", to: "/" },
            { label: "المنتجات", to: "/products" },
            { label: "السلة" },
          ]}

        />  

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#252d35]">سلة المشتريات</h1>
            <p className="mt-1 text-sm text-[#837b70]">{count} منتج في السلة</p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => emptyCart.mutate()}
              className="text-sm font-bold text-[#98764e]"
            >
              إفراغ السلة
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#e8e2d8] bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold text-[#252d35]">السلة فارغة</p>
            <p className="mt-2 text-sm text-[#837b70]">أضف منتجات عشان تقدر تكمل الطلب.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#273746] px-6 text-sm font-bold text-white"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
            <div className="space-y-3">
              {items.map((item) => {
                const product = item.product || item;
                const image = Array.isArray(product.images) ? product.images[0] : product.images;
                const quantity = Number(item.quantity) || 1;
                const price = salePrice(product);

                return (
                  <article
                    key={product._id || item._id}
                    className="flex gap-4 rounded-2xl border border-[#e8e2d8] bg-white p-4"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7f5f1] p-2"
                    >
                      <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link to={`/productdetails/${product._id}`} className="font-bold text-[#252d35]">
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem.mutate(product._id)}
                          className="text-xs font-bold text-[#837b70]"
                        >
                          حذف
                        </button>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-[#837b70]">{product.description}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="rounded-lg bg-[#f7f5f1] px-3 py-1 text-sm font-bold text-[#273746]">
                          الكمية: {quantity}
                        </span>
                        <span className="font-extrabold text-[#98764e]">{money(price * quantity)} ج.م</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-2xl border border-[#e8e2d8] bg-white p-5">
              <h2 className="text-lg font-bold text-[#252d35]">ملخص الطلب</h2>
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
              <Link
                to="/checkout"
                className="mt-5 flex h-11 items-center justify-center rounded-xl bg-[#273746] text-sm font-bold text-white transition hover:bg-[#98764e]"
              >
                إتمام الطلب
              </Link>
              <Link to="/products" className="mt-3 block text-center text-sm font-bold text-[#98764e]">
                متابعة التسوق
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
