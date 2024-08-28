"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useGetWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
    id: Id<"members">;
    label?: string;
    imageUrl?: string;
    isActive?: boolean;
};

export const UserItem = ({
    id,
    label = "Member",
    imageUrl,
    isActive = false,
}: Props) => {
    const workspaceId = useGetWorkspaceId();

    return (
        <Button
            variant="transparent"
            size="sm"
            className={cn(
                "flex items-center justify-start gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden text-[#f9edffcc]",
                isActive && "text-[#481349] bg-white/90 hover:bg-white/90"
            )}
            asChild
        >
            <Link href={`/workspaces/${workspaceId}/member/${id}`}>
                <Avatar className="size-5 rounded-md mr-1">
                    <AvatarImage src={imageUrl} className="rounded-md" />
                    <AvatarFallback className="rounded-md bg-sky-500 text-xs text-white">
                        {label[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <p className="text-sm truncate">{label}</p>
            </Link>
        </Button>
    );
};
