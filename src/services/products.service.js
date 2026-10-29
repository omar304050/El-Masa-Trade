import axiosInstance from "../config/axios.config";

export const getProducts = async () => {
  const response = await axiosInstance.get("/api/products");

  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/api/products/${id}`);

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
