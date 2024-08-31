"use client";

import dynamic from "next/dynamic";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Hint } from "@/components/hint";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";

import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";

import { toast } from "sonner";

import { Reactions } from "@/features/reactions/components/reactions";

import { useToggleReaction } from "@/features/reactions/hooks/use-toggle-reaction";
import { useConfirm } from "@/hooks/use-confirm";
import { usePanel } from "@/hooks/use-panel";

import { useDeleteMessage } from "../hooks/use-delete-message";
import { useUpdateMessage } from "../hooks/use-update-message";
import { ThreadBar } from "./thread-bar";

const Render = dynamic(() => import("./render"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type Props = {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createAt: Doc<"messages">["_creationTime"];
    updateAt: Doc<"messages">["updateAt"];
    isEditing: boolean;
    setEditing: (id: Id<"messages"> | null) => void;
    isCompact?: boolean;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadName?: string;
    threadImage?: string;
    threadTimestamp?: number;
};

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
    id,
    isAuthor,
    memberId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    image,
    createAt,
    updateAt,
    isEditing,
    isCompact,
    setEditing,
    hideThreadButton,
    threadCount,
    threadName,
    threadImage,
    threadTimestamp,
}: Props) => {
    const { parentMessageId, onClose, onOpenMessage } = usePanel();

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete message",
        "Are you sure you want to delete this message? This cannot be undone"
    );

    const updateMessage = useUpdateMessage();
    const removeMessage = useDeleteMessage();
    const toggleReaction = useToggleReaction();

    const isPending =
        updateMessage.isPending ||
        removeMessage.isPending ||
        toggleReaction.isPending;

    const onUpdate = ({ body }: { body: string }) => {
        updateMessage.mutate(
            {
                id,
                body,
            },
            {
                onSuccess: () => {
                    toast.success("Message updated");
                    setEditing(null);
                },
                onError: () => {
                    toast.error("Fail to update message");
                },
            }
        );
    };

    const onDelete = async () => {
        const ok = await confirm(
            "Delete message",
            "Are you sure you want to delete this message? This cannot be undone"
        );

        if (!ok) return;

        removeMessage.mutate(
            { id },
            {
                onSuccess: (messageId) => {
                    if (messageId === parentMessageId) {
                        onClose();
                    }

                    toast.success("Message deleted");
                },
                onError: () => {
                    toast.error("Fail to delete message");
                },
            }
        );
    };

    const onReaction = (value: string) => {
        toggleReaction.mutate(
            { messageId: id, value },
            {
                onError: () => {
                    toast.error("Fail to toggle reaction");
                },
            }
        );
    };

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div
                    className={cn(
                        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                        removeMessage.isPending &&
                            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                    )}
                >
                    <div className="flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createAt))}>
                            <button className=" w-10 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 leading-5 text-center hover:underline">
                                {format(createAt, "hh:mm")}
                            </button>
                        </Hint>

                        {isEditing ? (
                            <div className="size-full">
                                <Editor
                                    variant="update"
                                    disabled={updateMessage.isPending}
                                    defaultValue={JSON.parse(body)}
                                    onSubmit={onUpdate}
                                    onCancel={() => setEditing(null)}
                                />
                            </div>
                        ) : (
                            <div className="w-full flex flex-col">
                                <Render value={body} />

                                <Thumbnail url={image} />

                                {updateAt && (
                                    <span className="text-xs text-muted-foreground">
                                        (edited)
                                    </span>
                                )}

                                <Reactions
                                    data={reactions}
                                    onChange={onReaction}
                                />

                                <ThreadBar
                                    count={threadCount}
                                    image={threadImage}
                                    timestamp={threadTimestamp}
                                    onClick={() => onOpenMessage(id)}
                                />
                            </div>
                        )}
                    </div>

                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            onEdit={() => setEditing(id)}
                            onDelete={onDelete}
                            onThread={() => onOpenMessage(id)}
                            onReaction={onReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <ConfirmDialog />
            <div
                className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    removeMessage.isPending &&
                        "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}
            >
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage src={authorImage} alt={authorName} />
                            <AvatarFallback>
                                {authorName[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </button>

                    {isEditing ? (
                        <div className="size-full">
                            <Editor
                                variant="update"
                                disabled={updateMessage.isPending}
                                defaultValue={JSON.parse(body)}
                                onSubmit={onUpdate}
                                onCancel={() => setEditing(null)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button className="mr-2 font-bold text-primary hover:underline">
                                    {authorName}
                                </button>

                                <Hint
                                    label={formatFullTime(new Date(createAt))}
                                >
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(createAt, "hh:mm a")}
                                    </button>
                                </Hint>
                            </div>

                            <Render value={body} />

                            <Thumbnail url={image} />

                            {updateAt && (
                                <span className="text-xs text-muted-foreground">
                                    (edited)
                                </span>
                            )}

                            <Reactions data={reactions} onChange={onReaction} />

                            <ThreadBar
                                count={threadCount}
                                image={threadImage}
                                timestamp={threadTimestamp}
                                onClick={() => onOpenMessage(id)}
                            />
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        onEdit={() => setEditing(id)}
                        onDelete={onDelete}
                        onThread={() => onOpenMessage(id)}
                        onReaction={onReaction}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        </>
    );
};
