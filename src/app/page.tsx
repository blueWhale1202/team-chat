"use client";

import { useEffect } from "react";

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-modal";

import { useGetWorkspaces } from "@/features/workspaces/hooks/use-get-workspaces";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [open, setOpen] = useCreateWorkspaceModal();

    const { isPending, data } = useGetWorkspaces();

    const router = useRouter();

    const workspaceId = data?.[0]?._id;

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (workspaceId) {
            setOpen(false);
            router.replace(`/workspaces/${workspaceId}`);
        } else if (!open) {
            setOpen(true);
        }
    }, [workspaceId, isPending, open, setOpen, router]);

    return (
        <div className="h-full flex items-center justify-center">
            <Loader className="size-10 animate-spin text-muted-foreground" />
        </div>
    );
}
