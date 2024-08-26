"use client";

import { useEffect } from "react";

import { UserButton } from "@/features/auth/components/user-button";

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

export default function Home() {
    const [open, setOpen] = useCreateWorkspaceModal();
    const { isLoading, data } = useQuery(
        convexQuery(api.workspaces.getList, {})
    );

    const router = useRouter();

    const workspaceId = data?.[0]?._id;

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (workspaceId) {
            router.replace(`/workspaces/${workspaceId}`);
        } else if (!open) {
            setOpen(true);
            console.log("open dialog create workspace");
        }
    }, [workspaceId, isLoading, open, setOpen, router]);

    return (
        <div>
            <UserButton />
        </div>
    );
}
