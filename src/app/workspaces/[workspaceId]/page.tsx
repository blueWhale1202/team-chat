"use client";

import { useGetWorkspace } from "@/features/workspaces/hooks/use-get-workspace";
import { Loader } from "lucide-react";

export default function WorkspaceIdPage() {
    const { isPending, isError, data } = useGetWorkspace();

    if (isPending) {
        return <Loader className="size-4 animate-spin" />;
    }

    if (isError || !data) {
        return <h1>Not found </h1>;
    }

    return <div>ID: {data?._id}</div>;
}
