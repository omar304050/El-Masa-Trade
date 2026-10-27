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
  
  console.count("Layout rendered");
 
const { data: id, isLoading, isError, error } = useQuery({
  queryKey: ["createCart"],

  queryFn: async () => {
    console.log("1. query started");
  
    try {
      await checkGuestSession();
      console.log("2. session is valid");
  
      const cartId = localStorage.getItem("cartId");
  
      if (cartId) return cartId;
    } catch (error) {
      console.log("3. session check failed:", error.response?.status);
  
      if (error.response?.status !== 401) {
        throw error;
      }
    }
  
    console.log("4. creating guest session");
    await createGuestSession();
  
    console.log("5. creating cart");
    const created = await createCart();
  
    const newCartId = created?.cartId || created?.cart?.cartId;
    if (!newCartId) throw new Error("Failed to create cart");
  
    localStorage.setItem("cartId", newCartId);
    return newCartId;
  },
  retry: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
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