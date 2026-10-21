import { useEffect } from "react";

function Dialog({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-[#1c1915]/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 left-0 grid size-9 place-items-center rounded-full bg-white text-lg font-bold text-[#273746] shadow"
          aria-label="إغلاق"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Dialog;
