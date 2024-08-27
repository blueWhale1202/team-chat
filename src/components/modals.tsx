"use client";

import { useEffect, useState } from "react";

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { DeleteWorkspaceDialog } from "@/features/workspaces/components/delete-workspace-dialog";
import { EditWorkspaceModal } from "@/features/workspaces/components/edit-workspace-modal";

export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    // * To prevent hybrid error when render dialog on server
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <CreateWorkspaceModal />
            <EditWorkspaceModal />
            <DeleteWorkspaceDialog />
        </>
    );
};
