"use client";

import { ChannelHeader } from "@/features/channels/components/channel-header";
import { ChatInput } from "@/features/channels/components/chat-input";
import { MessageList } from "@/features/messages/components/message-list";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetCurrentChannel } from "@/features/channels/hooks/use-get-channel";
import { useGetMessages } from "@/features/messages/hooks/use-get-messages";

export default function ChannelIdPage() {
    const { isPending, data: channel } = useGetCurrentChannel();

    const { results, status, loadMore } = useGetMessages({
        channelId: channel?._id,
    });

    if (isPending || status === "LoadingFirstPage") {
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

            <MessageList
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />

            <ChatInput placeholder={`Message #${channel.name}`} />
        </div>
    );
}
