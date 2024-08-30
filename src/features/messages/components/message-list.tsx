"use client";

import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

import { ChannelHero } from "./channel-hero";
import { Message } from "./message";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useGetCurrentMember } from "@/features/members/hook/use-get-member";
import { GetMessagesReturnType } from "../hooks/use-get-messages";

import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

type Props = {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    channelCreationTime?: number;
    variant?: "channel" | "thread" | "conversation";
    data: GetMessagesReturnType | undefined;
    loadMore: () => void;
    isLoadingMore: boolean;
    canLoadMore: boolean;
};

const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
    memberImage,
    memberName,
    channelName,
    channelCreationTime,
    variant = "channel",
    data,
    loadMore,
    isLoadingMore,
    canLoadMore,
}: Props) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

    const { data: currentMember } = useGetCurrentMember();

    if (!data) return null;

    const groupedMessages = data?.reduce(
        (group, message) => {
            const dateKey = format(message._creationTime, "yyyy-MM-dd");

            if (!group[dateKey]) {
                group[dateKey] = [];
            }

            group[dateKey].unshift(message);

            return group;
        },
        {} as Record<string, typeof data>
    );

    return (
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto">
            <ScrollArea>
                {variant === "channel" && (
                    <ChannelHero
                        name={channelName!}
                        createTime={channelCreationTime!}
                    />
                )}

                {Object.entries(groupedMessages).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className="text-center my-2 relative">
                            <Separator className="absolute top-1/2 left-0 right-0" />
                            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                {formatDateLabel(dateKey)}
                            </span>
                        </div>

                        {messages?.map((message, index) => {
                            const prevMessage = messages[index - 1];

                            const isCompact =
                                prevMessage &&
                                prevMessage.user._id === message.user._id &&
                                differenceInMinutes(
                                    message._creationTime,
                                    prevMessage._creationTime
                                ) < TIME_THRESHOLD;

                            return (
                                <Message
                                    key={message._id}
                                    id={message._id}
                                    memberId={message.memberId}
                                    authorImage={message.user.image}
                                    authorName={message.user.name}
                                    isAuthor={
                                        message.memberId === currentMember?._id
                                    }
                                    reactions={message.reactions}
                                    body={message.body}
                                    image={message.image}
                                    updateAt={message.updateAt}
                                    createAt={message._creationTime}
                                    isEditing={editingId === message._id}
                                    setEditing={setEditingId}
                                    isCompact={isCompact}
                                    hideThreadButton={variant === "thread"}
                                    threadCount={message.threadCount}
                                    threadImage={message.threadImage}
                                    threadTimestamp={message.threadTimestamp}
                                />
                            );
                        })}
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};
