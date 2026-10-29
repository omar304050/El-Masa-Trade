import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProducts, updateProduct } from "../../services/products.service.js";
import Loader from "../../components/loader/loader.jsx";

function money(value) {
  return Number(value || 0).toLocaleString("ar-EG");
}

function formFromProduct(product) {
  return {
    name: product.name ?? "",
    description: product.description ?? "",
    price: product.price ?? "",
    stock: product.stock ?? "",
    category: product.category ?? "",
    isActive: Boolean(product.isActive),
    discountIsActive: Boolean(product.discount?.isActive),
    discountPercentage: product.discount?.percentage ?? 0,
  };
}

function AdminProducts() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = Array.isArray(data?.data) ? data.data : null;

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setEditing(null);
      setForm(null);
    },
    onError: (error) => {
      setFormError(error?.response?.data?.message || "حصل خطأ أثناء تحديث المنتج.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });

  function openEdit(product) {
    setFormError("");
    setEditing(product);
    setForm(formFromProduct(product));
  }

  function closeEdit() {
    if (updateMutation.isPending) return;
    setEditing(null);
    setForm(null);
    setFormError("");
  }

  useEffect(() => {
    if (!editing) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") closeEdit();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing, updateMutation.isPending]);

  function onField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onUpdate(event) {
    event.preventDefault();
    setFormError("");

    const price = Number(form.price);
    const stock = Number(form.stock);
    const discountPercentage = Number(form.discountPercentage);

    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      setFormError("الاسم والوصف والقسم مطلوبين.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError("السعر لازم يكون رقم صحيح غير سالب.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setFormError("المخزون لازم يكون رقم صحيح غير سالب.");
      return;
    }

    if (!Number.isFinite(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      setFormError("نسبة الخصم لازم تكون بين 0 و 100.");
      return;
    }

    updateMutation.mutate({
      id: editing._id,
      body: {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        stock,
        category: form.category.trim(),
        isActive: form.isActive,
        discount: {
          isActive: form.discountIsActive,
          percentage: discountPercentage,
        },
      },
    });
  }

  function onDelete(product) {
    const confirmed = window.confirm(`حذف «${product.name}»؟`);
    if (!confirmed) return;
    deleteMutation.mutate(product._id);
  }

  if (isLoading) return <Loader />;

  return (
    <section className="rounded-2xl border border-[#d5dbe3] bg-white p-6">
      <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5c5348]">
        عدّل بيانات المنتج من النافذة، أو احذفه من الجدول.
      </p>

      {deleteMutation.isError && (
        <p className="mt-4 text-sm text-[#8a4b3c]">
          {deleteMutation.error?.response?.data?.message || "حصل خطأ أثناء حذف المنتج."}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-[#e6dfd4]">
        <div className="grid grid-cols-[1.4fr_0.7fr_0.6fr_0.7fr_auto] bg-[#f7f5f1] px-4 py-3 text-xs font-bold text-[#6d6256]">
          <span>المنتج</span>
          <span>السعر</span>
          <span>المخزون</span>
          <span>الحالة</span>
          <span>إجراءات</span>
        </div>

        {(isError || products === null) && (
          <p className="px-4 py-10 text-center text-sm text-[#8a4b3c]">حصل خطأ أثناء تحميل المنتجات.</p>
        )}

        {!isError && products?.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-[#6d6256]">لا توجد منتجات.</p>
        )}

        {!isError && products?.length > 0 && (
          <ul>
            {products.map((product) => (
              <li
                key={product._id}
                className="grid grid-cols-[1.4fr_0.7fr_0.6fr_0.7fr_auto] items-center border-t border-[#e6dfd4] px-4 py-3 text-sm"
              >
                <span className="font-bold text-[#1c1915]">{product.name}</span>
                <span>{money(product.price)} ج.م</span>
                <span>{product.stock ?? "—"}</span>
                <span className={product.isActive ? "font-bold text-[#2f6b45]" : "font-bold text-[#8a4b3c]"}>
                  {product.isActive ? "نشط" : "غير نشط"}
                </span>
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="h-9 rounded-lg border border-[#e6dfd4] px-3 text-xs font-bold text-[#273746] transition hover:border-[#98764e]"
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    disabled={deleteMutation.isPending}
                    className="h-9 rounded-lg px-3 text-xs font-bold text-[#8a4b3c] transition hover:bg-[#f8efe9] disabled:opacity-50"
                  >
                    حذف
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1c1915]/40 p-4" onClick={closeEdit}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#e6dfd4] bg-white p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="edit-product-title" className="text-xl font-bold text-[#1c1915]">
              تعديل المنتج
            </h3>
            <p className="mt-1 text-sm text-[#6d6256]">{editing.name}</p>

            <form onSubmit={onUpdate} className="mt-5 space-y-4">
              <label className="block text-sm font-bold">
                الاسم
                <input
                  name="name"
                  value={form.name}
                  onChange={onField}
                  className="mt-2 h-12 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 text-sm font-normal outline-none focus:border-[#d4893a]"
                />
              </label>
              <label className="block text-sm font-bold">
                الوصف
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onField}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 py-3 text-sm font-normal outline-none focus:border-[#d4893a]"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold">
                  السعر
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={onField}
                    className="mt-2 h-12 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 text-sm font-normal outline-none focus:border-[#d4893a]"
                  />
                </label>
                <label className="block text-sm font-bold">
                  المخزون
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={onField}
                    className="mt-2 h-12 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 text-sm font-normal outline-none focus:border-[#d4893a]"
                  />
                </label>
              </div>
              <label className="block text-sm font-bold">
                القسم
                <input
                  name="category"
                  value={form.category}
                  onChange={onField}
                  className="mt-2 h-12 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 text-sm font-normal outline-none focus:border-[#d4893a]"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={onField}
                    className="size-4 accent-[#273746]"
                  />
                  منتج نشط
                </label>
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input
                    name="discountIsActive"
                    type="checkbox"
                    checked={form.discountIsActive}
                    onChange={onField}
                    className="size-4 accent-[#273746]"
                  />
                  خصم مفعّل
                </label>
              </div>
              <label className="block text-sm font-bold">
                نسبة الخصم
                <input
                  name="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={form.discountPercentage}
                  onChange={onField}
                  className="mt-2 h-12 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 text-sm font-normal outline-none focus:border-[#d4893a]"
                />
              </label>

              {formError && <p className="text-sm text-[#8a4b3c]">{formError}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-11 flex-1 rounded-xl bg-[#273746] text-sm font-bold text-white transition hover:bg-[#98764e] disabled:opacity-50"
                >
                  {updateMutation.isPending ? "جاري الحفظ" : "حفظ التعديل"}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="h-11 rounded-xl border border-[#e6dfd4] px-5 text-sm font-bold text-[#273746]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminProducts;
