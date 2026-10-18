import { useState, useEffect } from "react";
import { getProducts } from "../../services/products.service.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
    console.log(products);
  }, []);

  return (
    <section dir="rtl" className="font-['Cairo'] text-[#1c1915]">
      
<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
  {products?.data?.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>

    </section>
  );
}

export default Products;
