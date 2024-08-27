"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader, Plus, TriangleAlert } from "lucide-react";

import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";
import { useGetWorkspaces } from "../hooks/use-get-workspaces";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
    const {
        data: currentWorkspace,
        isPending,
        isError,
    } = useGetCurrentWorkspace();
    const workspaces = useGetWorkspaces();

    const [_open, setOpen] = useCreateWorkspaceModal();

    const router = useRouter();

    const filteredWorkspaces = useMemo(
        () => workspaces.data?.filter((w) => w._id !== currentWorkspace?._id),
        [workspaces, currentWorkspace]
    );

    if (isPending) {
        return (
            <Button className="size-9 relative overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl">
                <Loader className="size-5 animate-spin shrink-0" />
            </Button>
        );
    }

    if (isError) {
        return (
            <Button
                variant="destructive"
                className="size-9 relative overflow-hidden font-semibold text-xl"
            >
                <TriangleAlert className="size-5  shrink-0" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-9 relative overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl">
                    {currentWorkspace?.name[0].toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
                <DropdownMenuLabel>
                    <div className="flex flex-col justify-start items-start capitalize">
                        <p className="line-clamp-1">{currentWorkspace?.name}</p>
                        <span className="text-xs text-muted-foreground font-normal">
                            Active workspace
                        </span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {filteredWorkspaces?.map((workspace) => (
                        <DropdownMenuItem
                            key={workspace._id}
                            onClick={() =>
                                void router.push(`/workspaces/${workspace._id}`)
                            }
                        >
                            <div className="shrink-0 relative mr-2 size-9 rounded-md overflow-hidden flex items-center justify-center bg-[#616061] text-white text-lg font-semibold ">
                                {workspace.name[0].toUpperCase()}
                            </div>
                            <p className="capitalize truncate">
                                {workspace.name}
                            </p>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <div className="relative mr-2 size-9 rounded-md overflow-hidden flex items-center justify-center  text-slate-800 text-lg font-semibold ">
                        <Plus />
                    </div>
                    Create a new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
