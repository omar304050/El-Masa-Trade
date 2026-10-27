
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/orders.service.js";

const statuses = {
  pending: { label: "طلب جديد", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "تم التأكيد", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
};

function money(value) {
  return Number(value || 0).toLocaleString("en-EG");
}

function Orders() {
  const [openId, setOpenId] = useState(null);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) {
    return <p className="p-8 text-center">جاري تحميل الطلبات...</p>;
  }

  if (isError) {
    return <p className="p-8 text-center">حصل خطأ أثناء تحميل الطلبات.</p>;
  }

  return (
    <section dir="rtl" className="mx-auto max-w-5xl p-5 font-['Cairo']">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">طلباتي</h1>
        <Link to="/products" className="text-sm text-blue-700">
          تصفح المنتجات
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-xl bg-gray-50 p-8 text-center">
          لا توجد طلبات حتى الآن.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statuses[order.status] || statuses.pending;
            const isOpen = openId === order._id;

            return (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenId(isOpen ? null : order._id)
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-right"
                >
                  <div>
                    <p className="font-bold">
                      طلب #{String(order._id).slice(-6).toUpperCase()}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("ar-EG")
                        : ""}
                    </p>

                    <p className="mt-2 font-bold">
                      {money(order.totalAmount)} ج.م
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${status.color}`}
                    >
                      {status.label}
                    </span>

                    <span>{isOpen ? "−" : "+"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t bg-gray-50 p-5">
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>العميل:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>التليفون:</strong> {order.customerPhone}
                      </p>
                      <p>
                        <strong>العنوان:</strong> {order.customerAddress}
                      </p>
                    </div>

                    <div>
                      <h2 className="mb-3 font-bold">المنتجات</h2>

                      <ul className="space-y-3">
                        {order.items.map((item, index) => (
                          <li
                            key={item._id || `${item.product}-${index}`}
                            className="flex justify-between gap-3 text-sm"
                          >
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-gray-500">
                                الكمية: {item.quantity}
                              </p>
                            </div>

                            <p className="shrink-0 font-bold">
                              {money(item.price * item.quantity)} ج.م
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between border-t pt-3 font-bold">
                      <span>الإجمالي</span>
                      <span>{money(order.totalAmount)} ج.م</span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Orders;
