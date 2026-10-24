import { useState } from "react";

function CategoryFilter({ categories = [], category, onCategory }) {
  const [open, setOpen] = useState(false);
  const options = ["الكل", ...categories];
  const current = category || "الكل";

  function pick(value) {
    onCategory(value);
    setOpen(false);
  }

  return (
    <div>
      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-12 w-full items-center justify-between rounded-2xl border border-[#e8e2d8] bg-white px-4 text-sm font-bold text-[#273746] shadow-sm"
        >
          <span>{current}</span>
          <span className={`text-[#98764e] transition ${open ? "rotate-180" : ""}`}>⌄</span>
        </button>

        {open && (
          <div className="absolute inset-x-0 top-14 z-20 overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white shadow-lg">
            {options.map((item) => {
              const value = item === "الكل" ? "" : item;
              const active = category === value;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => pick(value)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-right text-sm font-bold ${
                    active ? "bg-[#f7f5f1] text-[#98764e]" : "text-[#273746]"
                  }`}
                >
                  {item}
                  {active && <span>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default CategoryFilter;
