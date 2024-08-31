"use client";

import { Id } from "../../../../../../convex/_generated/dataModel";

import { useEffect, useState } from "react";

import { Loader, TriangleAlert } from "lucide-react";

import { toast } from "sonner";

import { useMemberId } from "@/features/members/hook/use-member-id";
import { useGetWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Conversation } from "@/features/conversation/components/conversation";
import { useCreateOrGetConversation } from "@/features/conversation/hooks/use-create-get-conversation";

export default function MemberIdPage() {
    const memberId = useMemberId();
    const workspaceId = useGetWorkspaceId();

    const [conversationId, setConversationId] =
        useState<Id<"conversations"> | null>(null);

    const { mutate, isPending } = useCreateOrGetConversation();

    useEffect(() => {
        mutate(
            {
                workspaceId,
                memberId,
            },
            {
                onSuccess: (data) => {
                    setConversationId(data);
                },
                onError: () => {
                    toast.error("Fail to create or get conversation");
                },
            }
        );
    }, [workspaceId, memberId, mutate]);

    if (isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!conversationId) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-y-2">
                <TriangleAlert className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Conversation not found
                </p>
            </div>
        );
    }

    return <Conversation id={conversationId} />;
}
