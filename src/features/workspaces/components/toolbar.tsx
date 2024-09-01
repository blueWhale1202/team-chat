"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

import { Info, Search } from "lucide-react";

import { useGetChannels } from "@/features/channels/hooks/use-get-channels";
import { useGetMembers } from "@/features/members/hook/use-get-members";
import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";

export const Toolbar = () => {
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const { data: workspace } = useGetCurrentWorkspace();
    const { data: channels } = useGetChannels();
    const { data: members } = useGetMembers();

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(true);
            }
        };
        document.addEventListener("keydown", keydown);

        return () => {
            document.removeEventListener("keydown", keydown);
        };
    }, []);

    const handleSelect = (href: string) => {
        router.push(href);
        setOpen(false);
    };

    return (
        <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5 ">
            <div className="flex-1" />

            <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
                <Button
                    size="sm"
                    className="h-7 w-full px-2 justify-start bg-accent/25 hover:bg-accent/30 "
                    onClick={() => setOpen(true)}
                >
                    <Search className="size-4 mr-2 text-white" />
                    <span className="text-xs text-white ">
                        Search in {workspace?.name} Workspace
                    </span>
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Channels">
                            {channels?.map((channel) => (
                                <CommandItem
                                    key={channel._id}
                                    onSelect={() =>
                                        handleSelect(
                                            `/workspaces/${workspace?._id}/channels/${channel._id}`
                                        )
                                    }
                                >
                                    {channel.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Members">
                            {members?.map((member) => (
                                <CommandItem
                                    key={member._id}
                                    onSelect={() =>
                                        handleSelect(
                                            `/workspaces/${workspace?._id}/member/${member._id}`
                                        )
                                    }
                                >
                                    {member.user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>

            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button variant="transparent" size={"icon-sm"}>
                    <Info className="size-4 text-white" />
                </Button>
            </div>
        </nav>
    );
};
