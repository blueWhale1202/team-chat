"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { useGetWorkspaceId } from "../hooks/use-workspace-id";

type Props = {
    label: string;
    id: string;
    Icon: LucideIcon | IconType;
    isActive?: boolean;
};

export const SidebarItem = ({ id, label, isActive = false, Icon }: Props) => {
    const workspaceId = useGetWorkspaceId();
    return (
        <Button
            variant="transparent"
            size="sm"
            asChild
            className={cn(
                "flex items-center justify-start gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden text-[#f9edffcc]",
                isActive && "text-[#481349] bg-white/90 hover:bg-white/90"
            )}
        >
            <Link href={`/workspaces/${workspaceId}/channels/${id}`}>
                <Icon className="size-4 mr-1 shrink-0" />
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    );
};
