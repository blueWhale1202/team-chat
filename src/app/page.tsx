"use client";

import { useEffect } from "react";

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-modal";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
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
        }
    }, [workspaceId, isLoading, open, setOpen, router]);

    return (
        <div className="h-full flex items-center justify-center">
            <Loader className="size-10 animate-spin text-muted-foreground" />
        </div>
    );
}
