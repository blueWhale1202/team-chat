"use client";

import Quill from "quill";

import { EditorValues } from "@/interfaces";
import { ConvexError } from "convex/values";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Loader, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";

import { Message } from "./message";

import { useChannelId } from "@/features/channels/hooks/use-channel-id";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useInView } from "react-intersection-observer";

import { useGetCurrentMember } from "@/features/members/hook/use-get-member";
import { useGenerateUploadUrl } from "@/features/upload/hooks/use-generate-url";
import { useUploadFile } from "@/features/upload/hooks/use-upload-image";
import { useCreateMessage } from "../hooks/use-create-message";
import { useGetMessageById } from "../hooks/use-get-message";
import { useGetMessages } from "../hooks/use-get-messages";

import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, MMMM d");
};

type CreateMessage = Pick<
    Doc<"messages">,
    "channelId" | "workspaceId" | "body" | "image" | "parentMessageId"
>;

type Props = {
    messageId: Id<"messages">;
    onClose: () => void;
};

export const Thread = ({ messageId, onClose }: Props) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

    const editorRef = useRef<Quill>(null);
    const [isPending, setIsPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0);

    const workspaceId = useGetWorkspaceId();
    const channelId = useChannelId();

    const createMessage = useCreateMessage();
    const generateUrl = useGenerateUploadUrl();
    const uploadImage = useUploadFile();

    const bottomRef = useRef<HTMLDivElement>(null);
    const [scrollDown, setScrollDown] = useState(0);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollDown]);

    const message = useGetMessageById(messageId);
    const { data: currentMember } = useGetCurrentMember();
    const { results, status, loadMore } = useGetMessages({
        channelId,
        parentMessageId: messageId,
    });

    const canLoadMore = status === "CanLoadMore";
    const isLoadingMore = status === "LoadingMore";

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            loadMore();
        }
    }, [inView, loadMore]);

    if (message.isPending || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[52px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Thead</p>

                    <Button variant="ghost" size="icon-sm" onClick={onClose}>
                        <X className="size-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="h-full flex justify-center items-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!message.data) {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[52px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Thead</p>

                    <Button variant="ghost" size="icon-sm" onClick={onClose}>
                        <X className="size-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="h-full flex flex-col justify-center items-center gap-y-2">
                    <TriangleAlert className="size-6 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                        Message not found
                    </p>
                </div>
            </div>
        );
    }

    const groupedMessages = results.reduce(
        (group, message) => {
            const dateKey = format(message._creationTime, "yyyy-MM-dd");

            if (!group[dateKey]) {
                group[dateKey] = [];
            }

            group[dateKey].unshift(message);

            return group;
        },
        {} as Record<string, typeof results>
    );

    const msg = message.data;

    const onSubmit = async ({ body, image }: EditorValues) => {
        try {
            setIsPending(true);
            editorRef.current?.enable(false);

            const message: CreateMessage = {
                body,
                channelId,
                workspaceId,
                parentMessageId: messageId,
                image: undefined,
            };

            if (image) {
                const url = await generateUrl.mutateAsync({});
                const { storageId } = await uploadImage.mutateAsync({
                    file: image,
                    url,
                });

                message.image = storageId;
            }

            await createMessage.mutateAsync(message);

            setEditorKey((prev) => prev + 1);
            setScrollDown((prev) => prev + 1);
        } catch (error) {
            const errorMessage =
                error instanceof ConvexError
                    ? error.message
                    : "Unexpected error occurred";

            toast.error(errorMessage);
        } finally {
            setIsPending(false);
            editorRef.current?.enable(true);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="h-[49px] flex-shrink-0 flex justify-between items-center px-4 border-b">
                <p className="text-lg font-bold">Thead</p>

                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                    <X className="size-5 text-muted-foreground" />
                </Button>
            </div>

            <ScrollArea className="flex-1 pb-4">
                <div className="h-full flex flex-col-reverse">
                    <div ref={bottomRef} className="h-1"></div>

                    {Object.entries(groupedMessages).map(
                        ([dateKey, messages]) => (
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
                                        prevMessage.user._id ===
                                            message.user._id &&
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
                                                message.memberId ===
                                                currentMember?._id
                                            }
                                            reactions={message.reactions}
                                            body={message.body}
                                            image={message.image}
                                            updateAt={message.updateAt}
                                            createAt={message._creationTime}
                                            isEditing={
                                                editingId === message._id
                                            }
                                            setEditing={setEditingId}
                                            isCompact={isCompact}
                                            hideThreadButton
                                            threadCount={message.threadCount}
                                            threadImage={message.threadImage}
                                            threadTimestamp={
                                                message.threadTimestamp
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )
                    )}

                    {isLoadingMore && (
                        <div className="text-center my-2 relative">
                            <Separator className="absolute top-1/2 left-0 right-0" />
                            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                <Loader className="size-4 animate-spin" />
                            </span>
                        </div>
                    )}

                    <Message
                        id={msg._id}
                        hideThreadButton
                        memberId={msg.memberId}
                        authorName={msg.user.name}
                        authorImage={msg.user.image}
                        isAuthor={msg.memberId === currentMember?._id}
                        body={msg.body}
                        image={msg.image}
                        createAt={msg._creationTime}
                        updateAt={msg.updateAt}
                        reactions={msg.reactions}
                        isEditing={editingId === msg._id}
                        setEditing={setEditingId}
                    />

                    <div className="h-1" ref={ref}>
                        <p className="sr-only">Load more</p>
                    </div>
                </div>
            </ScrollArea>

            <div className="px-4">
                <Editor
                    key={editorKey}
                    disabled={isPending}
                    innerRef={editorRef}
                    placeholder="Reply..."
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
};
