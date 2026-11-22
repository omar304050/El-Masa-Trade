
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import Loader from "../../components/loader/loader.jsx";
import { useProductContext } from "../../context/ProductContext.jsx";
import ProductSort from "../../components/ProductSort/ProductSort.jsx";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter.jsx";

function salePrice(product) {
  const price = Number(product.price) || 0;
  const percentage = Number(product.discount?.percentage) || 0;

  if (product.discount?.isActive && percentage > 0) {
    return price - (price * percentage) / 100;
  }

  return price;
}

function Products() {
  const [sort, setSort] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";

  const { products, isLoading } = useProductContext();

  if (isLoading) return <Loader />;

  const items = products?.data || [];

  const categories = [
    ...new Set(items.map((product) => product.category).filter(Boolean)),
  ];

  // Category Filter
  let list = items.filter(
    (product) => !category || product.category === category
  );

  // Sort Products
  if (sort === "high") {
    list.sort((a, b) => salePrice(b) - salePrice(a));
  }

  if (sort === "low") {
    list.sort((a, b) => salePrice(a) - salePrice(b));
  }

  // Change Category
  function setCategory(value) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
  }

  return (
    <section dir="rtl" className="font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 px-5 sm:px-8 lg:px-12">
        <CategoryFilter
          categories={categories}
          category={category}
          onCategory={setCategory}
        />

        <ProductSort sort={sort} onSort={setSort} />
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12 xl:grid-cols-4">
        {list.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          لا توجد منتجات مطابقة للبحث
        </p>
      )}
    </section>
  );
}

export default Products;
