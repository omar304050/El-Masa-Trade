
import { Link } from "react-router-dom";

function formatPrice(value) {
  return Number(value).toLocaleString("ar-EG", { maximumFractionDigits: 1 });
}

function ProductCard({ product }) {
  const item = product?.name ? product : product?.data;
  if (!item) return null;

  const image = Array.isArray(item.images) ? item.images[0] : item.images;
  const price = Number(item.price) || 0;
  const percentage = Number(item.discount?.percentage) || 0;
  const hasDiscount = Boolean(item.discount?.isActive) && percentage > 0;
  const finalPrice = hasDiscount ? price * (1 - percentage / 100) : price;
  const inStock = Number(item.stock) > 0;

  const optimizedImage = image?.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_500/"
  );

  return (
    <Link
      to={`/productdetails/${item._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b99a72] hover:shadow-xl"
    >
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f7f5f1] p-5">
        <span
          className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold ${
            inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {inStock ? "متوفر" : "غير متوفر"}
        </span>

        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#98764e] px-3 py-1 text-xs font-bold text-white">
            خصم {percentage}%
          </span>
        )}

        <img
          src={optimizedImage}
          alt={item.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 text-right" dir="rtl">
        <h2 className="line-clamp-2 min-h-14 text-lg font-bold leading-7 text-[#252d35] transition-colors group-hover:text-[#98764e]">
          {item.name}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-[#837b70]">
          {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eee9e1] pt-4">
          <span className="text-xs text-[#837b70]">المخزون: {item.stock ?? 0}</span>

          <span className="text-left">
            {hasDiscount && (
              <span className="block text-sm text-[#837b70] line-through">
                {formatPrice(price)} ج.م
              </span>
            )}
            <span className="text-lg font-extrabold text-[#98764e]">
              {formatPrice(finalPrice)} ج.م
            </span>
          </span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#273746] px-4 py-3 text-sm font-bold text-white transition-colors group-hover:bg-[#98764e]">
          عرض تفاصيل المنتج
          <span aria-hidden="true">←</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
