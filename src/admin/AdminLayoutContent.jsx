import { useSidebarCollapse } from "../context/sidebarCollapseContext"
function AdminContent ({children}){
 const  {isCollapsed , seIsCollapsed} = useSidebarCollapse()



    return <div className={`transition-all duration-300 ${
        isCollapsed ? "pr-20" : "pr-64"
      }`}>

     {children}

    </div>
}

export default AdminContent