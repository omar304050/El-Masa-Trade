import { Link } from "react-router-dom";

function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-[#837b70]">
      {items.map((item, index) => {
        const last = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            {last || !item.to ? (
              <span className="font-semibold text-[#252d35]">{item.label}</span>
            ) : (
              <Link to={item.to} className="transition hover:text-[#98764e]">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
