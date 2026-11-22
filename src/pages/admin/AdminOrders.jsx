
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../services/admin.service.js";

const statuses = {
  pending: { label: "طلب جديد", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "تم التأكيد", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
};

function money(value) {
  return Number(value || 0).toLocaleString("en-EG");
}

function AdminOrders() {
  const [openId, setOpenId] = useState(null);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: getAllOrders,
  });

  if (isLoading) {
    return <p className="p-8 text-center">جاري تحميل الطلبات...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        حصل خطأ أثناء تحميل الطلبات.
      </p>
    );
  }

  const orders = data?.data || [];

  return (
    <section dir="rtl" className="mx-auto max-w-5xl p-5 font-['Cairo']">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <p className="mt-2 text-sm text-gray-500">
          إجمالي الطلبات: {orders.length}
        </p>
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
                  onClick={() => setOpenId(isOpen ? null : order._id)}
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

                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-gray-200">
                      <svg viewBox="0 0 20 20" className="size-4" fill="none">
                        <path
                          d="M4.5 10h11"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        {!isOpen && (
                          <path
                            d="M10 4.5v11"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t bg-gray-50 p-5">
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>العميل:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>التليفون:</strong> {order.customerPhone}
                      </p>
                      <p>
                        <strong>العنوان:</strong> {order.customerAddress}
                      </p>
                      {order.customerEmail && (
                        <p>
                          <strong>الإيميل:</strong> {order.customerEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <h2 className="mb-3 font-bold">المنتجات</h2>

                      <ul className="space-y-3">
                        {order.items?.map((item, index) => (
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

export default AdminOrders;
