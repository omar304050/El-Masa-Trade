function Loader() {
  return (
    <div className="h-screen" role="status">
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 font-['Cairo']">
      <span className="relative grid size-14 place-items-center">
        <span className="absolute inset-0 rounded-full border-2 border-[#e8e2d8]" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#98764e] border-r-[#273746]" />
        <span className="size-2.5 rounded-full bg-[#98764e]" />
      </span>
      <p className="text-sm font-semibold text-[#837b70]">جاري التحميل</p>
      </div>
    </div>
  );
}

export default Loader;
