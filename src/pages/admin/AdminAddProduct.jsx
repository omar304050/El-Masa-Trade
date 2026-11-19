import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/products.service.js";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  category: "",
  discountIsActive: false,
  discountPercentage: "0",
};

function AdminAddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      navigate("/admin/admin-products");
    },
    onError: (error) => {
      setFormError(error?.response?.data?.message || "حصل خطأ أثناء إضافة المنتج.");
    },
  });

  function onField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onImages(event) {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      setFormError("أقصى عدد للصور 5.");
      setImages(files.slice(0, 5));
      return;
    }
    setFormError("");
    setImages(files);
  }

  function onSubmit(event) {
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

    createMutation.mutate({
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      stock,
      category: form.category.trim(),
      discountIsActive: form.discountIsActive,
      discountPercentage,
      images,
    });
  }

  return (
    <section className="rounded-2xl border border-[#d5dbe3] bg-white p-6">
      <h2 className="text-2xl font-bold">إضافة منتج</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5c5348]">
        املأ بيانات المنتج. الصور اختيارية، والحد الأقصى 5 صور.
      </p>

      <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-4">
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
        <label className="block text-sm font-bold">
          الصور
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImages}
            className="mt-2 w-full rounded-xl border border-[#e6dfd4] bg-[#fbf8f3] px-4 py-3 text-sm font-normal file:me-3 file:rounded-lg file:border-0 file:bg-[#273746] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
          />
        </label>
        {images.length > 0 && (
          <p className="text-xs text-[#6d6256]">تم اختيار {images.length} صور</p>
        )}

        {formError && <p className="text-sm text-[#8a4b3c]">{formError}</p>}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="h-11 rounded-xl bg-[#273746] px-5 text-sm font-bold text-white transition hover:bg-[#98764e] disabled:opacity-50"
        >
          {createMutation.isPending ? "جاري الإضافة" : "إضافة المنتج"}
        </button>
      </form>
    </section>
  );
}

export default AdminAddProduct;
