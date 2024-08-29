"use client";

import { ChannelHeader } from "@/features/channels/components/channel-header";
import { ChatInput } from "@/features/channels/components/chat-input";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetCurrentChannel } from "@/features/channels/hooks/use-get-channel";

export default function ChannelIdPage() {
    const { isPending, data: channel } = useGetCurrentChannel();

    if (isPending) {
        return (
            <div className="h-full flex-1 flex flex-col items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex flex-col items-center justify-center gap-y-2">
                <TriangleAlert className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Channel not found
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <ChannelHeader title={channel.name} />

            <div className="flex-1"></div>

            <ChatInput placeholder={`Message #${channel.name}`} />
        </div>
    );
}
