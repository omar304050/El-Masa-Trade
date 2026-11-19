import axiosInstance from "../config/axios.config";

export const getProducts = async () => {
  const response = await axiosInstance.get("/api/products");

  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/api/products/${id}`);

  return response.data;
};

export const createProduct = async (product) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", product.price);
  formData.append("stock", product.stock);
  formData.append("category", product.category);
  formData.append("discountIsActive", product.discountIsActive ? "true" : "false");
  formData.append("discountPercentage", product.discountPercentage ?? 0);

  (product.images || []).forEach((file) => {
    formData.append("images", file);
  });

  const response = await axiosInstance.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await axiosInstance.put(`/api/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};
