import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SliderExport from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProductById, getProducts } from "../../services/products.service";

const Slider = SliderExport.default ?? SliderExport;

const imageSlider = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 640, settings: { slidesToShow: 2 } },
  ],
};

const categories = {
  motors: "مواتر",
  pumps: "طلمبات",
  "Water Pumps": "طلمبات مياه",
  gearboxes: "جيربوكسات",
};

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductById(id).then((response) => {
      setProduct(response.data);
      setImageIndex(0);
    });
  }, [id]);

  useEffect(() => {
    getProducts().then((response) => setProducts(response.data || []));
  }, []);

  if (!product) {
    return <p className="p-10 text-center font-['Cairo']">جاري تحميل المنتج...</p>;
  }

  const images = product.images || [];
  const price = Number(product.price) || 0;
  const percentage = Number(product.discount?.percentage) || 0;
  const hasDiscount = product.discount?.isActive && percentage > 0;
  const finalPrice = hasDiscount ? price - (price * percentage) / 100 : price;
  const money = (value) => Number(value).toLocaleString("ar-EG", { maximumFractionDigits: 1 });
  const inStock = product.stock > 0;
  const category = categories[product.category] || product.category;

  return (
    <section dir="rtl" className="font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-12">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#837b70]">
          <Link to="/" className="transition hover:text-[#98764e]">الرئيسية</Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-[#98764e]">المنتجات</Link>
          <span>/</span>
          <span className="font-semibold text-[#252d35]">{product.name}</span>
        </nav>

        <div className="mt-4  grid items-start gap-5 lg:grid-cols-2">
          <div>
            <div className="relative  flex h-72 items-center justify-center overflow-hidden rounded-3xl border border-[#e8e2d8] bg-white p-5 sm:h-80">
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-[#98764e] px-3 py-1 text-xs font-bold text-white">
                  خصم {percentage}%
                </span>
              )}
              <img src={images[imageIndex]} alt={product.name} className="max-h-full w-full object-contain" />
            </div>

            {(images.length > 1 || products.length > 0) && (
            <div className="product-slider details-slider mt-4" dir="ltr">
              <Slider {...imageSlider} infinite={(images.length > 1 ? images.length : products.length) > 3}>
                {images.length > 1
                  ? images.map((image, index) => (
                      <div key={image}>
                        <button
                          type="button"
                          onClick={() => setImageIndex(index)}
                          className="flex h-24 w-full items-center justify-center rounded-2xl border border-[#e8e2d8] bg-white p-2"
                        >
                          <img src={image} alt="" className="max-h-full max-w-full object-contain" />
                        </button>
                      </div>
                    ))
                  : products.map((item) => (
                      <div key={item._id}>
                        <Link
                          to={`/productdetails/${item._id}`}
                          className="flex h-24 items-center justify-center rounded-2xl border border-[#e8e2d8] bg-white p-2"
                        >
                          <img src={item.images?.[0]} alt={item.name} className="max-h-full max-w-full object-contain" />
                        </Link>
                      </div>
                    ))}
              </Slider>
            </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#e8e2d8] bg-white p-5">
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

            <h1 className="mt-3 text-2xl font-bold leading-tight text-[#252d35] sm:text-3xl">{product.name}</h1>
            <p className="mt-2 text-sm leading-6 text-[#837b70]">{product.description}</p>

            <div className="mt-4 border-y border-[#eee9e1] py-3">
              {hasDiscount && <p className="text-sm text-[#837b70] line-through">{money(price)} ج.م</p>}
              <p className="text-3xl font-extrabold text-[#98764e]">{money(finalPrice)} ج.م</p>
              {hasDiscount && (
                <p className="mt-2 text-sm font-semibold text-emerald-700">توفر {money(price - finalPrice)} ج.م</p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f7f5f1] px-4 py-2">
                <p className="text-xs text-[#837b70]">القسم</p>
                <p className="mt-1 font-bold text-[#252d35]">{category || "—"}</p>
              </div>
              <div className="rounded-2xl bg-[#f7f5f1] px-4 py-2">
                <p className="text-xs text-[#837b70]">المخزون</p>
                <p className="mt-1 font-bold text-[#252d35]">{product.stock ?? 0} قطعة</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-10 w-fit items-center overflow-hidden rounded-xl border border-[#e8e2d8]">
                <button type="button" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} className="h-full px-4 text-lg font-bold text-[#273746]">
                  −
                </button>
                <span className="min-w-10 text-center font-bold">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="h-full px-4 text-lg font-bold text-[#273746]" disabled={!inStock}>
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={!inStock}
                className="h-10 flex-1 rounded-xl bg-[#273746] px-6 text-sm font-bold text-white transition hover:bg-[#98764e] disabled:cursor-not-allowed disabled:bg-[#cfc8be]"
              >
                {inStock ? "أضف إلى السلة" : "غير متوفر حالياً"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
