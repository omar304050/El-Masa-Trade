
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/products.service.js";

const productContext = createContext();

export const ProductProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", search],
    queryFn: () => getProducts(search),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <productContext.Provider value={{ products, isLoading, error }}>
      {children}
    </productContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(productContext);
};
