import { Link } from "react-router-dom";
import { getAdminDashboard } from "../../services/admin.service.js";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/loader/loader.jsx";

function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const stats = data?.data;

  const summaries = [
    { label: "إجمالي المنتجات", value: stats?.totalProducts },
    { label: "المنتجات النشطة", value: stats?.activeProducts },
    { label: "غير المتوفر", value: stats?.outOfStock },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1c1915]">لوحة التحكم</h2>
      <p className="mt-1 text-sm text-[#6d6256]">نظرة مختصرة على الكتالوج.</p>

      {isError && (
        <p className="mt-6 text-sm text-[#8a4b3c]">
          حصل خطأ أثناء تحميل الإحصائيات.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {summaries.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e6dfd4] bg-white px-5 py-4"
          >
            <p className="text-sm text-[#6d6256]">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#1c1915]">
              {typeof item.value === "number"
                ? item.value === 0
                  ? "لا يوجد"
                  : item.value.toLocaleString("ar-EG")
                : "—"}
            </p>
          </article>
        ))}
      </div>

      <Link
        to="/admin/products"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#273746] px-5 text-sm font-bold text-white transition hover:bg-[#98764e]"
      >
        إدارة المنتجات
      </Link>
    </div>
  );
}

export default AdminDashboard;
