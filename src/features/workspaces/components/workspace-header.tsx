"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Hint } from "@/components/hint";

import { ChevronDown, Edit, ListFilter, SquarePen, Trash } from "lucide-react";

import { Doc } from "../../../../convex/_generated/dataModel";
import { useDeleteWorkspaceModal } from "../store/use-delete-modal";
import { useEditWorkspaceModal } from "../store/use-edit-modal copy";
import { useInviteModal } from "../store/use-invite-modal";

type Props = {
    workspace: Doc<"workspaces">;
    isAdmin: boolean;
};

export const WorkspaceHeader = ({ workspace, isAdmin }: Props) => {
    const setOpenEditModal = useEditWorkspaceModal()[1];
    const setOpenDeleteModal = useDeleteWorkspaceModal()[1];
    const setOpenInviteModal = useInviteModal()[1];

    return (
        <div className="h-[49px] flex items-center justify-between px-4 gap-0.5">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="transparent"
                        size="sm"
                        className="font-semibold text-lg w-auto p-1.5 overflow-hidden "
                    >
                        <p className="truncate">{workspace.name}</p>
                        <ChevronDown className="size-4 ml-2 shrink-0" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="start">
                    <DropdownMenuLabel>
                        <div className="flex flex-col items-start">
                            <p className="font-semibold line-clamp-1">
                                {workspace.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-normal">
                                Active workspace
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => setOpenInviteModal(true)}
                            >
                                <p className="line-clamp-1">
                                    Invite people to {workspace.name}
                                </p>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    Preference
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                void setOpenEditModal(true)
                                            }
                                        >
                                            <Edit className="size-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() =>
                                                void setOpenDeleteModal(true)
                                            }
                                        >
                                            <Trash className="size-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-0.5">
                <Hint label="Filter conversation" side="bottom">
                    <Button variant="transparent" size={"icon-sm"}>
                        <ListFilter className="size-4" />
                    </Button>
                </Hint>

                <Hint label="New message" side="bottom">
                    <Button variant="transparent" size={"icon-sm"}>
                        <SquarePen className="size-4" />
                    </Button>
                </Hint>
            </div>
        </div>
    );
};
