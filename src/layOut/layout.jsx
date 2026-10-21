import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import Footer from "../footer/Footer.jsx";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop.jsx";
import { ProductProvider } from "../context/ProductContext.jsx";

const Layout = () => {
    return (
        <ProductProvider>
        <div className="flex min-h-screen flex-col bg-[#f6f3ee]">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
                <Footer />
            </div>
        </ProductProvider>
    )
}

export default Layout;