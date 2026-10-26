import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import Footer from "../footer/Footer.jsx";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop.jsx";
import { ProductProvider } from "../context/ProductContext.jsx";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { CartProvider } from "../context/cartContext.jsx";
import { createGuestSession , checkGuestSession , createCart} from "../services/cart.service.js";



const Layout = () => {

    const cartId = localStorage.getItem("cartId");

 
const { data: id, isLoading, isError, error } = useQuery({
  queryKey: ["createCart"],

  queryFn: async () => {
    try {
      await checkGuestSession();

      const cartId = localStorage.getItem("cartId");

      if (cartId) {
        return cartId;
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        throw error;
      }
    }

    await createGuestSession();

    const created = await createCart();
    const newCartId = created?.cartId || created?.cart?.cartId;

    if (!newCartId) {
      throw new Error("Failed to create cart");
    }

    localStorage.setItem("cartId", newCartId);

    return newCartId;
  },
});

    return (
        <CartProvider>
        <ProductProvider>
        <div className="flex min-h-screen flex-col bg-[#f6f3ee]">
            <Toaster /> 
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
                <Footer />
            </div>
        </ProductProvider>
        </CartProvider>
    )
}

export default Layout;