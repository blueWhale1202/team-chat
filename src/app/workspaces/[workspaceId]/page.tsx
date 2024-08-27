"use client";

import { useGetCurrentWorkspace } from "@/features/workspaces/hooks/use-get-workspace";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";

export default function WorkspaceIdPage() {
    const { isPending, isError, data } = useGetCurrentWorkspace();

    if (isPending) {
        return <Loader className="size-4 animate-spin" />;
    }

    if (isError) {
        return <h1>Something went wrong</h1>;
    }

    if (!data) {
        redirect("/");
    }

    return <div>ID: {data?._id}</div>;
}
