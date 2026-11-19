import { createBrowserRouter , Navigate } from "react-router-dom";
import Layout from "./layOut/layout.jsx";
import Home from "./pages/home/Home.jsx";
import Products from "./pages/products/Products.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Brands from "./pages/brands/Brands.jsx";
import Categories from "./pages/categories/Categories.jsx";
import ProductDetails from "./pages/productDetails/ProductDetails.jsx";
import CheckOut from "./pages/checkOut/CheckOut.jsx";
import Orders from "./pages/orders/Orders.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminAddProduct from "./pages/admin/AdminAddProduct.jsx";
import AdminGuard from "./pages/admin/AdminGuard.jsx";



const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            { index: true, element: <Home /> },
            { path: 'products', element: <Products /> },
            { path: 'cart', element: <Cart /> },
            { path: 'brands', element: <Brands /> },
            { path: 'categories', element: <Categories /> },
            { path: 'productdetails/:id', element: <ProductDetails /> },
            { path: 'checkout', element: <CheckOut /> },
            { path: 'allorders', element: <Orders /> },
        ]
    },

    {
        path: "admin/login",
        element: <AdminLogin />,
    },
    {
        path: "/admin",
        element: <AdminGuard />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { path: "admin-dashboard", element: <AdminDashboard /> },
                    { path: "admin-products", element: <AdminProducts /> },
                    { path: "admin-add-product", element: <AdminAddProduct /> },
                    { index: true, element: <Navigate to="/admin/admin-dashboard" replace /> },
                ],
            },
        ],
    },
]);




export default router;