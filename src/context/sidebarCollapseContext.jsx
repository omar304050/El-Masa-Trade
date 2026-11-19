import { createContext , useContext } from "react";
import { useState } from "react";



const sidebarCollapseContext = createContext();

export const SidebarCollapseProvider = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <sidebarCollapseContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            {children}
        </sidebarCollapseContext.Provider>
    )
}
export const useSidebarCollapse = () => {
    return useContext(sidebarCollapseContext);
}
