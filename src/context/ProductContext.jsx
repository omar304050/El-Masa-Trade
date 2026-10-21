import { createContext , useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/products.service.js"



const productContext = createContext();


export const ProductProvider = ({children}) => {

    const { data : products, isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: () => getProducts(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return (
        <productContext.Provider value={{ products, isLoading, error }}>
            {children}
        </productContext.Provider>
    )
};

export const useProductContext = () => {
   return   useContext(productContext);
}
