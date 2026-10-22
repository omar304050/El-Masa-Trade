import { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/cart.service";


const CartContext = createContext();


export const CartProvider = ({ children }) => {
    const cartId = localStorage.getItem("cartId");

    const { data: cartData } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(cartId),
        enabled: !!cartId,
    });

    return (
        <CartContext.Provider value={{ cartData }}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => {
    return useContext(CartContext);
};



export {  useCart };