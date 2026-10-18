import SliderExport from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProducts } from "../../services/products.service.js";
import { useState, useEffect } from "react";


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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
    console.log(products);
  }, []);

  return (
    <section dir="rtl" className="bg-[#f4f7fb] py-14 font-['Cairo'] text-[#0b2548]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <h2 className="mb-8 text-2xl font-semibold">منتجاتنا</h2>
        <div className="product-slider" dir="ltr">
          <Slider {...sliderSettings}>
            {products?.data?.map((product) => (
              <div key={product._id} className="px-2 text-center">
                <div className="mx-auto flex h-72 items-end justify-center sm:h-80">
                  <img
                    src={product.images}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="mt-4 text-lg font-bold">{product.name}</h3>
                <p className="mt-1 font-bold text-[#8a7460] border border-[#8a7460] rounded-md p-2 w-fit mx-auto ">{product.price} ج.م</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default ProductSlider;
