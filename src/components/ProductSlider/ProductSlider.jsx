import SliderExport from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { products } from "../../data/products.js";

const Slider = SliderExport.default ?? SliderExport;

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2800,
  pauseOnHover: true,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

function ProductSlider() {
  return (
    <section dir="rtl" className="bg-[#f4f7fb] py-14 font-['Cairo'] text-[#0b2548]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 className="mb-8 text-2xl font-semibold">منتجاتنا</h2>
        <div className="product-slider" dir="ltr">
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <div key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="mx-auto h-[420px] w-full object-contain sm:h-[480px]"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default ProductSlider;
