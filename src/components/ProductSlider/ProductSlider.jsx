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
      className={className}
      onClick={onClick}
      aria-label={next ? "التالي" : "السابق"}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 42,
        height: 42,
        borderRadius: "999px",
        background: "#16130f",
        border: "1px solid rgba(212,168,74,0.7)",
        zIndex: 3,
        boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d={next ? "M11 4L6 9l5 5" : "M7 4l5 5-5 5"}
          stroke="#f0d7a4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
    const update = () => setSlidesToShow(slidesForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section dir="rtl" className="relative overflow-hidden bg-[#100e0c] py-14 font-['Cairo'] text-[#f8f1e6] sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,74,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-[#d4a84a] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold text-[#d4a84a]">مختارات ماسة تريد</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">منتجاتنا</h2>
          </div>
          <Link
            to="/products"
            className="mb-1 shrink-0 border-b border-[#d4a84a]/70 pb-0.5 text-sm font-semibold text-[#f0d7a4] transition hover:border-[#f0d7a4] hover:text-white"
          >
            عرض الكل
          </Link>
        </div>

        <div className="product-slider home-slider" dir="ltr">
          <Slider
            key={slidesToShow}
            dots={slidesToShow > 1}
            infinite
            speed={700}
            slidesToShow={slidesToShow}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={3200}
            pauseOnHover
            arrows
            prevArrow={<SliderArrow direction="prev" />}
            nextArrow={<SliderArrow direction="next" />}
          >
            {products?.data?.map((product) => {
              const image = Array.isArray(product.images) ? product.images[0] : product.images;

              return (
                <div key={product._id} className="h-full px-2">
                  <Link
                    to={`/productdetails/${product._id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#d4a84a]/25 bg-[#171410] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#e7c98a]/70"
                  >
                    <div className="flex h-52 items-center justify-center bg-[radial-gradient(circle_at_50%_42%,#fffdf8,#e8d7be_78%)] sm:h-64">
                      <img
                        src={image}
                        alt={product.name}
                        className="max-h-[76%] max-w-[76%] object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div dir="rtl" className="flex flex-1 flex-col border-t border-[#d4a84a]/20 px-4 py-4 text-center">
                      <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-[#f8f1e6] sm:text-base">
                        {product.name}
                      </h3>
                      <p className="mt-auto pt-3 text-sm font-bold tracking-wide text-[#f0d7a4]">
                        {Number(product.price).toLocaleString("ar-EG")} ج.م
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default ProductSlider;
