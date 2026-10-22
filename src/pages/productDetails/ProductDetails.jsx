import { useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/products.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/loader/loader.jsx";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.jsx";
import Dialog from "../../components/Dialog/Dialog.jsx";
import { addToCart  } from "../../services/cart.service";
import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";



const categories = {
  motors: "مواتر",
  pumps: "طلمبات",
  "Water Pumps": "طلمبات مياه",
  gearboxes: "جيربوكسات",
};

function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [imageOpen, setImageOpen] = useState(false);
  const cartId = localStorage.getItem("cartId");
  const queryClient = useQueryClient();
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>  getProductById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  if (isLoading) return <Loader />;
  
  if (isError) {
    return <p>حصل خطأ: {error.message}</p>;
  }
  
  if (!product) {
    return <p>المنتج غير موجود</p>;
  }


  const item = product.data;
  const images = item.images || [];
  const price = Number(item.price) || 0;
  const percentage = Number(item.discount?.percentage) || 0;
  const hasDiscount = item.discount?.isActive && percentage > 0;
  const finalPrice = hasDiscount ? price - (price * percentage) / 100 : price;
  const money = (value) => Number(value).toLocaleString("en-EG", { maximumFractionDigits: 1 });
  const inStock = item.stock > 0;
  const category = categories[item.category] || item.category;

  return (
    <section dir="rtl" className="flex min-h-[calc(100svh-8.5rem)] flex-col font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-4 sm:px-8">
        <Breadcrumb
          items={[
            { label: "الرئيسية", to: "/" },
            { label: "المنتجات", to: "/products" },
            { label: item.name },
          ]}
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <div className="relative flex h-[450px] items-center justify-center overflow-hidden rounded-2xl border border-[#e8e2d8] bg-[#f7f5f1] p-5">
            {hasDiscount && (
              <span className="absolute left-3 top-3 rounded-full bg-[#98764e] px-3 py-1 text-xs font-bold text-white">
                خصم {percentage}%
              </span>
            )}
          
              <img src={images[0]} alt={item.name} onClick={() => setImageOpen(true)} className="max-h-full w-full object-contain" />
       
          </div>

          <Dialog open={imageOpen} onClose={() => setImageOpen(false)}>
            <img src={images[0]} alt={item.name} className="max-h-[85vh] w-full rounded-2xl object-contain" />
          </Dialog>

          <div className="flex h-[450px] flex-col rounded-2xl border border-[#e8e2d8] bg-white p-5 text-right">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <span className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-bold text-[#98764e]">
                  {category}
                </span>
              )}
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {inStock ? "متوفر" : "غير متوفر"}
              </span>
            </div>

            <h1 className="mt-3 text-xl font-bold leading-7 text-[#252d35]">{item.name}</h1>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#837b70]">{item.description}</p>

            <div className="mt-3 border-y border-[#eee9e1] py-2">
              {hasDiscount && (
                <p className="text-sm text-[#837b70] line-through">{money(price)} ج.م</p>
              )}
              <p className="text-2xl font-extrabold text-[#98764e]">{money(finalPrice)} ج.م</p>
              {hasDiscount && (
                <p className="text-sm font-semibold text-emerald-700">وفر {money(price - finalPrice)} ج.م</p>
              )}
            </div>

            <div className="mt-auto space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#f7f5f1] px-3 py-2">
                <p className="text-xs text-[#837b70]">القسم</p>
                <p className="mt-0.5 font-bold text-[#252d35]">{category || "—"}</p>
              </div>
              <div className="rounded-xl bg-[#f7f5f1] px-3 py-2">
                <p className="text-xs text-[#837b70]">المخزون</p>
                <p className="mt-0.5 font-bold text-[#252d35]">{item.stock ?? 0} قطعة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-10 items-center rounded-xl border border-[#e8e2d8]">
                <button type="button" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} className="h-full px-4 text-lg font-bold text-[#273746]">
                  −
                </button>
                <span className="min-w-10 text-center font-bold">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="h-full px-4 text-lg font-bold text-[#273746]" disabled={!inStock}>
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(id , cartId , quantity).then(() => {
                    queryClient.invalidateQueries({ queryKey: ["cart"] });
                    toast.success("تم إضافة المنتج إلى السلة");
                  }).catch((error) => {
                    console.log("error:", error);
                    toast.error("حصل خطأ أثناء إضافة المنتج إلى السلة");
                  });
                }}
                type="button"
                disabled={!inStock}
                className="h-10 flex-1 rounded-xl bg-[#273746] px-6 text-sm font-bold text-white transition hover:bg-[#98764e] disabled:cursor-not-allowed disabled:bg-[#cfc8be]
              "
              >
                {inStock ? "أضف إلى السلة" : "غير متوفر حالياً"}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
