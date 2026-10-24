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
  const hasDiscount = product.discount?.isActive && percentage > 0;
  return hasDiscount ? price - (price * percentage) / 100 : price;
}

function Products() {
  const [sort, setSort] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  function setCategory(value) {
    if (value) setSearchParams({ category: value });
    else setSearchParams({});
  }

  const { products, isLoading } = useProductContext();

  if (isLoading) return <Loader />;

  const items = products?.data || [];
  const categories = [...new Set(items.map((product) => product.category).filter(Boolean))];
  const list = items
    .filter((product) => !category || product.category === category)
    .sort((a, b) => {
      if (sort === "high") return salePrice(b) - salePrice(a);
      if (sort === "low") return salePrice(a) - salePrice(b);
      return 0;
    });

  return (
    <section dir="rtl" className="font-['Cairo'] text-[#1c1915]">
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 px-5 sm:px-8 lg:px-12">
        <CategoryFilter categories={categories} category={category} onCategory={setCategory} />
        <ProductSort sort={sort} onSort={setSort} />
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
