
import { Link } from "react-router-dom";
import SliderExport from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProducts } from "../../services/products.service.js";
import { useState, useEffect } from "react";

const Slider = SliderExport.default ?? SliderExport;

function SliderArrow({ className, style, onClick, direction }) {
  const next = direction === "next";

  return (
    <button
      type="button"
      className={`${className} !flex !items-center !justify-center !size-10 !rounded-full !bg-white !border !border-[#e8e1d6] !shadow-md !z-10 hover:!bg-[#273746] hover:!text-white transition-all before:!hidden`}
      onClick={onClick}
      aria-label={next ? "التالي" : "السابق"}
      style={{ ...style }}
    >
     <svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#B58A45"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
<path d={next ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
</svg>
    </button>
  );
}

function slidesForWidth(width) {
  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 3;
}

function ProductSlider() {
  const [products, setProducts] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const update = () =>
      setSlidesToShow(slidesForWidth(window.innerWidth));

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  const settings = {
    key: slidesToShow,
    dots: slidesToShow > 1,
    infinite: products?.data?.length > slidesToShow,
    speed: 600,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <SliderArrow direction="prev" />,
    nextArrow: <SliderArrow direction="next" />,
  };

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-[#f8f7f4] py-16 sm:py-20 lg:py-24 font-['Cairo']"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-[#d4a84a]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-[#273746]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#b58a45]" />
              <span className="text-xs font-bold tracking-[2px] text-[#a17b3e]">
                EL MASA COLLECTION
              </span>
            </div>

            <h2 className="text-3xl font-bold text-[#273746] sm:text-4xl">
              اكتشف منتجاتنا
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
              مجموعة مختارة من أفضل المنتجات الصناعية بجودة
              عالية وأسعار تنافسية.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#273746]/15 bg-white px-6 py-3 text-sm font-bold text-[#273746] shadow-sm transition hover:border-[#273746] hover:bg-[#273746] hover:text-white"
          >
            تصفح جميع المنتجات

            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-1"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        {/* Products Slider */}
        <div className="product-slider home-slider" dir="ltr">

          {products?.data?.length > 0 ? (
            <Slider {...settings}>
              {products.data.map((product) => {
                const image = Array.isArray(product.images)
                  ? product.images[0]
                  : product.images;

                return (
                  <div key={product._id} className="px-2.5 pb-6 pt-2">
                    <Link
                      to={`/productdetails/${product._id}`}
                      dir="rtl"
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#eae6df] bg-white shadow-[0_5px_25px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-2 hover:border-[#d4a84a]/50 hover:shadow-[0_18px_40px_rgba(39,55,70,0.10)]"
                    >
                      {/* Product Image */}
                      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f5f4f0] p-7 sm:h-72">

                        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#a17b3e] shadow-sm">
                          EL MASA
                        </span>

                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="text-sm text-gray-400">
                            لا توجد صورة
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent" />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col p-5">

                        <div className="mb-3 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b58a45]" />
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                            منتج صناعي
                          </span>
                        </div>

                        <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-7 text-[#273746] transition-colors group-hover:text-[#a17b3e]">
                          {product.name}
                        </h3>

                        <div className="mt-5 flex items-center justify-between border-t border-[#eeeae3] pt-4">

                          <div>
                            <p className="mb-1 text-[10px] text-gray-400">
                              السعر
                            </p>

                            <p className="text-lg font-bold text-[#a17b3e]">
                              {Number(product.price).toLocaleString("ar-EG")}
                              <span className="mr-1 text-xs font-medium">
                                ج.م
                              </span>
                            </p>
                          </div>

                          <span className="grid size-10 place-items-center rounded-full bg-[#273746] text-white transition-all duration-300 group-hover:bg-[#b58a45]">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                          </span>

                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Slider>
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">
              لا توجد منتجات متاحة حالياً.
            </p>
          )}
        </div>

      </div>

      {/* Slider Dots Styling */}
      <style>{
        `
.home-slider {
  position: relative;
}

.home-slider .slick-prev {
  right: -45px !important;
  left: auto !important;
}

.home-slider .slick-next {
  left: -45px !important;
  right: auto !important;
}

/* Mobile */
@media (max-width: 640px) {
  .home-slider .slick-prev,
  .home-slider .slick-next {
    top: auto !important;
    bottom: -45px !important;
    left: auto !important;
    right: auto !important;
    transform: none !important;
  }

  .home-slider .slick-prev {
    left: calc(50% - 45px) !important;
  }

  .home-slider .slick-next {
    right: calc(50% - 45px) !important;
  }
}
`
     }</style>
    </section>
  );
}

export default ProductSlider;
