"use client";

import { useEffect, useState } from "react";

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

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
        </>
    );
};
