"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGetCurrentMember } from "@/features/members/hook/use-get-member";
import { ChevronDown, Edit, Trash } from "lucide-react";
import { useDeleteChannelModal } from "../store/use-delete-modal";
import { useEditChannelModal } from "../store/use-edit-modal";

type Props = {
    title: string;
};

export const ChannelHeader = ({ title }: Props) => {
    const setOpenEditModal = useEditChannelModal()[1];
    const setOpenDeleteModal = useDeleteChannelModal()[1];

    const { data: member } = useGetCurrentMember();

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            {member?.role === "admin" ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 overflow-hidden w-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                            <p className="text-lg font-semibold truncate">
                                # {title}
                            </p>
                            <ChevronDown className="size-4 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-32">
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => setOpenEditModal(true)}
                            >
                                <Edit className="size-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setOpenDeleteModal(true)}
                            >
                                <p className="text-rose-600 flex items-center">
                                    <Trash className="size-4 mr-2" />
                                    Delete
                                </p>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <p className="text-lg font-semibold truncate"># {title}</p>
            )}
        </div>
    );
};
