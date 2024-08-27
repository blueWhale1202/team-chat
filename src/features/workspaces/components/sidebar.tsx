"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";

import { SidebarButton } from "./sidebar-button";
import { WorkspaceSwitcher } from "./workspace-switcher";

import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";

export const Sidebar = () => {
    const pathname = usePathname();
    return (
        <aside className="w-[70px] h-full flex flex-col gap-y-4 items-center pb-4 pt-[9px] bg-[#481349]">
            <WorkspaceSwitcher />
            <SidebarButton
                Icon={Home}
                label="Home"
                isActive={pathname.includes("/workspaces")}
            />
            <SidebarButton Icon={MessageSquare} label="DMs" />
            <SidebarButton Icon={Bell} label="Activity" />
            <SidebarButton Icon={MoreHorizontal} label="More" />
            <div className="mt-auto flex flex-col justify-center items-center gap-y-1">
                <UserButton />
            </div>
        </aside>
    );
};
