import { useState, useEffect } from "react";
import { getProducts } from "../../services/products.service.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import Loader from "../../components/loader/loader.jsx";

function salePrice(product) {
  const price = Number(product.price) || 0;
  const percentage = Number(product.discount?.percentage) || 0;
  const hasDiscount = product.discount?.isActive && percentage > 0;
  return hasDiscount ? price - (price * percentage) / 100 : price;
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const list = [...(products?.data || [])].sort((a, b) => {
    if (sort === "high") return salePrice(b) - salePrice(a);
    if (sort === "low") return salePrice(a) - salePrice(b);
    return 0;
  });

  return (
    <section dir="rtl" className="font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-3 px-5 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => setSort("high")}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            sort === "high" ? "bg-[#98764e] text-white" : "bg-white text-[#273746]"
          }`}
        >
          من الأغلى للأقل
        </button>
        <button
          type="button"
          onClick={() => setSort("low")}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            sort === "low" ? "bg-[#98764e] text-white" : "bg-white text-[#273746]"
          }`}
        >
          من الأقل للأغلى
        </button>
      </div>

<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
  {list.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>

    </section>
  );
}

export default Products;
