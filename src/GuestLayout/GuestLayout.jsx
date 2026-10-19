import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop.jsx";

const GuestLayout = () => {
return (
        <div>
            <ScrollToTop />
            <Outlet />
        </div>
    );
};

export default GuestLayout;