
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/products.service.js";

import Loader from "../../components/loader/loader.jsx";
import Dialog from "../../components/Dialog/Dialog.jsx";

function money(value) {
  return Number(value || 0).toLocaleString("ar-EG");
}

function AdminProducts() {
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  // جلب المنتجات
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = data?.data || [];

  // تحديث المنتج
  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => updateProduct(id, body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });

      closeEdit();
    },

    onError: (error) => {
      setError(
        error.response?.data?.message || "حصل خطأ أثناء تحديث المنتج"
      );
    },
  });

  // حذف المنتج
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });

      setDeleting(null);
    },
  });

  // فتح نافذة التعديل
  function openEdit(product) {
    setEditing(product);
    setError("");
    setImage(null);
    setImagePreview(product.images?.[0] || "");

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      isActive: product.isActive,
      discountIsActive: product.discount?.isActive || false,
      discountPercentage: product.discount?.percentage || 0,
    });
  }

  // إغلاق نافذة التعديل
  function closeEdit() {
    {updateMutation.isPending ? <Loader /> : "حفظ التعديل"}

    setEditing(null);
    setForm(null);
    setImage(null);
    setImagePreview("");
    setError("");
  }

  // تغيير بيانات الحقول
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  // اختيار صورة جديدة
  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  // حفظ التعديل
  function handleUpdate(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      setError("الاسم والوصف والقسم مطلوبين");
      return;
    }

    const body = new FormData();

    body.append("name", form.name.trim());
    body.append("description", form.description.trim());
    body.append("price", form.price);
    body.append("stock", form.stock);
    body.append("category", form.category.trim());
    body.append("isActive", form.isActive);

    body.append(
      "discount",
      JSON.stringify({
        isActive: form.discountIsActive,
        percentage: Number(form.discountPercentage),
      })
    );

    // الصورة هتتبعت لو اختار صورة جديدة فقط
    if (image) {
      body.append("image", image);
    }

    updateMutation.mutate({
      id: editing._id,
      body,
    });
  }

  // حذف المنتج
  function handleDelete() {
    if (!deleting) return;

    deleteMutation.mutate(deleting._id);
  }

  if (isLoading) return <Loader />;

  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="text-2xl font-bold">إدارة المنتجات</h2>

      <p className="mt-2 text-sm text-gray-500">
        تقدر تعدّل بيانات المنتجات أو تحذفها.
      </p>

      {isError && (
        <p className="mt-4 text-red-600">
          حصل خطأ أثناء تحميل المنتجات.
        </p>
      )}

      {/* قائمة المنتجات */}
      <div className="mt-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between border-b py-4"
          >
            <div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {money(product.price)} ج.م
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(product)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                تعديل
              </button>

              <button
                onClick={() => setDeleting(product)}
                className="rounded-lg px-4 py-2 text-sm text-red-600"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة حذف المنتج */}
      <Dialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
      >
        <div className="w-[min(92vw,26rem)] rounded-2xl bg-white p-6">
          <h3 className="text-xl font-bold">حذف المنتج</h3>

          <p className="my-4">
            متأكد إنك عايز تحذف {deleting?.name}؟
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 rounded-lg bg-red-600 p-3 text-white"
            >
              {deleteMutation.isPending ? <Loader /> : "نعم، احذف"}
            </button>

            <button
              onClick={() => setDeleting(null)}
              className="flex-1 rounded-lg border p-3"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Dialog>

      {/* نافذة تعديل المنتج */}
      {editing && form && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <h3 className="text-xl font-bold">تعديل المنتج</h3>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">

              {/* الاسم */}
              <label className="block text-sm font-bold">
                الاسم
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

              {/* الوصف */}
              <label className="block text-sm font-bold">
                الوصف
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

              {/* السعر والمخزون */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-bold">
                  السعر
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border p-3"
                  />
                </label>

                <label className="block text-sm font-bold">
                  المخزون
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border p-3"
                  />
                </label>
              </div>

              {/* القسم */}
              <label className="block text-sm font-bold">
                القسم
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

              {/* صورة المنتج */}
              <div>
                <label className="block text-sm font-bold">
                  صورة المنتج
                </label>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="my-3 h-36 w-36 rounded-lg border object-contain"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 w-full text-sm"
                />
              </div>

              {/* حالة المنتج والخصم */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                منتج نشط
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="discountIsActive"
                  checked={form.discountIsActive}
                  onChange={handleChange}
                />
                خصم مفعّل
              </label>

              <label className="block text-sm font-bold">
                نسبة الخصم
                <input
                  type="number"
                  name="discountPercentage"
                  min="0"
                  max="100"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-lg bg-[#273746] p-3 text-white"
                >
                  {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديل"}
                </button>

                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-lg border px-5"
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
