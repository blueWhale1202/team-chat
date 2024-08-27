"use client";

import { Loader, TriangleAlert } from "lucide-react";
import { useGetCurrentMember } from "../hooks/use-get-member";
import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";
import { WorkspaceHeader } from "./workspace-header";

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
        </div>
    );
};
