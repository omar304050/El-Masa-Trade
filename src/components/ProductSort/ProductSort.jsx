function ProductSort({ sort, onSort }) {
  const options = [
    { value: "high", label: "من الأغلى للأقل" },
    { value: "low", label: "من الأقل للأغلى" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSort(sort === option.value ? "" : option.value)}
          className={`rounded-xl border px-4 py-2 text-sm font-bold ${
            sort === option.value ? "border-[#98764e] bg-[#98764e] text-white" : "border-[#e8e2d8] bg-white text-[#273746]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ProductSort;
