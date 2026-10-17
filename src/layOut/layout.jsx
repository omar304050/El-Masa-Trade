import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import Footer from "../footer/Footer.jsx";

const Layout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-[#f6f3ee]">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;