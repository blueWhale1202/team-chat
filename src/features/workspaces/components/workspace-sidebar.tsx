"use client";

import {
    Loader,
    MessageSquareText,
    SendHorizonal,
    TriangleAlert,
} from "lucide-react";

import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";

import { useGetCurrentMember } from "@/features/members/hook/use-get-member";
import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";

export const WorkspaceSidebar = () => {
    const member = useGetCurrentMember();
    const workspace = useGetCurrentWorkspace();

    if (member.isPending || workspace.isPending) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#5e2c5f]">
                <Loader className="size-5 text-white animate-spin" />
            </div>
        );
    }

    if (!member.data || !workspace.data) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#5e2c5f] gap-y-2">
                <TriangleAlert className="size-5 text-white" />
                <p className="text-white text-sm">Workspace not found</p>
            </div>
        );
    }
    return (
        <div className="h-full flex flex-col bg-[#5e2c5f] gap-y-2">
            <WorkspaceHeader
                workspace={workspace.data}
                isAdmin={member.data.role === "admin"}
            />

            <div className="flex flex-col gap-y-1 px-2 mt-3">
                <SidebarItem
                    id="thread"
                    label="Threads"
                    Icon={MessageSquareText}
                />

                <SidebarItem
                    id="draft"
                    label="Drafts & Sent"
                    Icon={SendHorizonal}
                />
            </div>

            <WorkspaceSection currentMember={member.data} />
        </div>
    );
};
