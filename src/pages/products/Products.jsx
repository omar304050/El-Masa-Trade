import { Link } from "react-router-dom";
import { products } from "../../data/products.js";

function Products() {
  return (
    <section dir="rtl" className="font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">المنتجات</h1>
        <p className="mt-2 text-sm text-[#8a7460]">{products.length} منتج</p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/productdetails/${product.id}`}
              className="overflow-hidden rounded-2xl border border-[#e6dfd4] bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full bg-[#fbf8f3] object-contain"
              />
              <h2 className="px-4 py-4 text-lg font-bold">{product.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
