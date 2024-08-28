"use client";

import { useGetChannels } from "@/features/channels/hooks/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-modal";
import { useGetCurrentMember } from "@/features/members/hook/use-get-member";
import { useGetCurrentWorkspace } from "@/features/workspaces/hooks/use-get-workspace";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkspaceIdPage() {
    const router = useRouter();

    const workspace = useGetCurrentWorkspace();
    const channels = useGetChannels();
    const member = useGetCurrentMember();

    const [open, setOpen] = useCreateChannelModal();

    const channelId = channels.data?.[0]?._id;
    const isAdmin = member.data?.role === "admin";

    useEffect(() => {
        if (
            workspace.isPending ||
            channels.isPending ||
            !workspace.data ||
            !member.data
        )
            return;

        if (channelId) {
            router.replace(
                `/workspaces/${workspace.data._id}/channels/${channelId}`
            );
        } else if (!open && isAdmin) {
            setOpen(true);
        }
    }, [
        workspace,
        channels,
        isAdmin,
        member,
        channelId,
        router,
        setOpen,
        open,
    ]);

    if (workspace.isPending || channels.isPending) {
        return (
            <div className="h-full flex-1 flex flex-col items-center justify-center gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!workspace.data) {
        return (
            <div className="h-full flex-1 flex flex-col items-center justify-center gap-2">
                <TriangleAlert className="size-6  text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Workspace not found
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex-1 flex flex-col items-center justify-center gap-2">
            <TriangleAlert className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No channel found</p>
        </div>
    );
}
