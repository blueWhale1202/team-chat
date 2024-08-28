"use client";

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";
import { DeleteChannelDialog } from "@/features/channels/components/delete-channel-dialog";
import { EditChannelModal } from "@/features/channels/components/edit-channel-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { DeleteWorkspaceDialog } from "@/features/workspaces/components/delete-workspace-dialog";
import { EditWorkspaceModal } from "@/features/workspaces/components/edit-workspace-modal";
import { InviteModal } from "@/features/workspaces/components/invite-modal";
import { useMounted } from "@/hooks/use-mounted";

export const Modals = () => {
    // * To prevent hybrid error when render dialog on server
    const mounted = useMounted();

    if (!mounted) {
        return null;
    }

    return (
        <>
            <InviteModal />

            <CreateWorkspaceModal />
            <EditWorkspaceModal />
            <DeleteWorkspaceDialog />

            <CreateChannelModal />
            <EditChannelModal />
            <DeleteChannelDialog />
        </>
    );
};
