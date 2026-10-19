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
        width: 40,
        height: 40,
        borderRadius: "999px",
        background: "#fff",
        border: "1px solid #e6dfd4",
        zIndex: 3,
        boxShadow: "0 2px 8px rgba(11, 37, 72, 0.12)",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d={next ? "M7 4l5 5-5 5" : "M11 4L6 9l5 5"}
          stroke="#0b2548"
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
    <section dir="rtl" className="bg-[#f4f7fb] py-10 font-['Cairo'] text-[#0b2548] sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 className="mb-8 text-2xl font-semibold">منتجاتنا</h2>
        <div className="product-slider home-slider" dir="ltr">
          <Slider
            key={slidesToShow}
            dots={slidesToShow > 1}
            infinite
            speed={600}
            slidesToShow={slidesToShow}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={2800}
            pauseOnHover
            arrows
            prevArrow={<SliderArrow direction="prev" />}
            nextArrow={<SliderArrow direction="next" />}
          >
            {products?.data?.map((product) => (
              <div key={product._id} className="px-6 text-center sm:px-3">
                <div className="mx-auto flex h-44 items-center justify-center sm:h-72 lg:h-80">
                  <img
                    src={Array.isArray(product.images) ? product.images[0] : product.images}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="mx-auto mt-3 line-clamp-2 min-h-12 max-w-64 text-base font-bold leading-6 sm:mt-4 sm:text-lg">
                  {product.name}
                </h3>
                <p className="mx-auto mt-2 inline-block whitespace-nowrap rounded-md border border-[#8a7460] px-3 py-1 text-sm font-bold text-[#8a7460]">
                  {Number(product.price).toLocaleString("ar-EG")} ج.م
                </p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default ProductSlider;
