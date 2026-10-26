import axiosInstance from "../config/axios.config";

export const createGuestSession = async () => {
  const response = await axiosInstance.post("/api/guest-session");
  return response.data;
};


export const checkGuestSession = async () => {
  const response = await axiosInstance.get("/api/guest-session");
  return response.data;
};



export const createCart = async () => {
  const response = await axiosInstance.post("/api/cart");
  return response.data;
};

export const getCart = async (id) => {
  const response = await axiosInstance.get(`/api/cart/${id}`);
  return response.data;
};

export const loadCart = async () => {
  const created = await createCart();
  const id = created?.cartId || created?.cart?.cartId 
  return getCart(id);
};

export const addToCart = async (productId , cartId , quantity) => {
  const response = await axiosInstance.post(`/api/cart/${cartId}`, { productId , quantity });
  return response.data;
};

export const removeFromCart = async (cartId , productId) => {
  const response = await axiosInstance.delete(`/api/cart/${cartId}` ,   { data: { productId },
  });
  return response.data;
};

export const clearCart = async (cartId) => {
  const response = await axiosInstance.delete(`/api/cart/${cartId}/clear`);
  return response.data;
};

