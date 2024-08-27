"use client";

import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";

export const Toolbar = () => {
    const { data } = useGetCurrentWorkspace();

    return (
        <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5 ">
            <div className="flex-1" />

            <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
                <Button
                    size="sm"
                    className="h-7 w-full px-2 justify-start bg-accent/25 hover:bg-accent/30 "
                >
                    <Search className="size-4 mr-2 text-white" />
                    <span className="text-xs text-white ">
                        Search {data?.name} Workspace
                    </span>
                </Button>
            </div>

            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button variant="transparent" size={"icon-sm"}>
                    <Info className="size-4 text-white" />
                </Button>
            </div>
        </nav>
    );
};
