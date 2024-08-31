"use client";

import { useGetMemberById } from "@/features/members/hook/use-get-member-by-id";
import { useMemberId } from "@/features/members/hook/use-member-id";
import { MessageList } from "@/features/messages/components/message-list";
import { useGetMessages } from "@/features/messages/hooks/use-get-messages";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChatInput } from "./chat-input";
import { ConversationHeader } from "./conversation-header";

type Props = {
    id: Id<"conversations">;
};

export const Conversation = ({ id }: Props) => {
    const memberId = useMemberId();

    const { isPending, data: member } = useGetMemberById(memberId);
    const { results, status, loadMore } = useGetMessages({
        conversationId: id,
    });

    if (isPending || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ConversationHeader
                memberImage={member?.user.image}
                memberName={member?.user.name}
                onClick={() => {}}
            />

            <MessageList
                data={results}
                variant="conversation"
                memberImage={member?.user.image}
                memberName={member?.user.name}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />

            <ChatInput
                placeholder={`Message ${member?.user.name}`}
                conversationId={id}
            />
        </div>
    );
};
