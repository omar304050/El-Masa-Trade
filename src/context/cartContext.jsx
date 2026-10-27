import { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/cart.service";


const CartContext = createContext();


export const CartProvider = ({ children }) => {
    const cartId = localStorage.getItem("cartId");

    const { data: cartData , isLoading, isError, error } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(cartId),
        enabled: !!cartId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchIntervalInBackground: false,
    });

    return (
        <CartContext.Provider value={{ cartData , isLoading, isError, error }}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => {
    return useContext(CartContext);
};



export {  useCart };