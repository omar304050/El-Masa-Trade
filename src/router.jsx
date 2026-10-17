import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./GuestLayout/GuestLayout.jsx";
import Layout from "./layOut/layout.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import ForgotPassword from "./pages/forgetPassword/ForgetPassword.jsx";
import UpdatePassword from "./pages/updatepassword/UpdatePassword.jsx";
import Home from "./pages/home/Home.jsx";
import Products from "./pages/products/Products.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Brands from "./pages/brands/Brands.jsx";
import Categories from "./pages/categories/Categories.jsx";
import ProductDetails from "./pages/productdetails/ProductDetails.jsx";
import CheckOut from "./pages/checkout/CheckOut.jsx";
import Orders from "./pages/orders/Orders.jsx";


const router = createBrowserRouter([
    {
    element: <GuestLayout/>
    ,children: [
        {
            path: "login",
            element: <Login/>
        },
        {
            path: "register",
            element: <Register/>
        },
        {
            path: "forgot-password",
            element: <ForgotPassword/>
        },
        {
            path: "Update-Password",
            element: <UpdatePassword/>
        },
    ]
    },

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
    }
]);




export default router;