import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function Layout({children}:{children:ReactNode}){
    return (
    <SidebarProvider>
        <div className="flex">
            <div>
                <AppSidebar/>
                <SidebarTrigger></SidebarTrigger>
            </div>
            <div>
                <main>
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
)}