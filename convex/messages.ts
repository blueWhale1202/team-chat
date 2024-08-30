import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

type Thread = {
    count: number;
    image: string | undefined;
    timestamp: number;
};

const populateThread = async (
    ctx: QueryCtx,
    messageId: Id<"messages">
): Promise<Thread> => {
    const messages = await ctx.db
        .query("messages")
        .withIndex("by_parent_message_id", (q) =>
            q.eq("parentMessageId", messageId)
        )
        .collect();

    if (messages.length === 0) {
        return {
            count: 0,
            image: undefined,
            timestamp: 0,
        };
    }

    const lastMessage = messages[messages.length - 1];
    const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

    if (!lastMessageMember) {
        return {
            count: messages.length,
            image: undefined,
            timestamp: 0,
        };
    }

    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

    return {
        count: messages.length,
        image: lastMessageUser?.image,
        timestamp: lastMessage._creationTime,
    };
};

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
    return ctx.db
        .query("reactions")
        .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
        .collect();
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId);
};

export const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {
    return await ctx.db
        .query("members")
        .withIndex("by_user_id_workspace_id", (q) =>
            q.eq("userId", userId).eq("workspaceId", workspaceId)
        )
        .unique();
};

export const get = query({
    args: {
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (
        ctx,
        { channelId, conversationId, parentMessageId, paginationOpts }
    ) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        let _conversationId = conversationId;

        // Only possible if we are replying in a thread in 1:1 conversation
        if (!conversationId && !channelId && parentMessageId) {
            const parentMessage = await ctx.db.get(parentMessageId);

            if (!parentMessage) {
                throw new ConvexError("Parent message not found");
            }

            _conversationId = parentMessage.conversationId;
        }

        const results = await ctx.db
            .query("messages")
            .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
                q
                    .eq("channelId", channelId)
                    .eq("parentMessageId", parentMessageId)
                    .eq("conversationId", _conversationId)
            )
            .order("desc")
            .paginate(paginationOpts);

        return {
            ...results,
            page: (
                await Promise.all(
                    results.page.map(async (message) => {
                        const member = await populateMember(
                            ctx,
                            message.memberId
                        );
                        const user = member
                            ? await populateUser(ctx, member.userId)
                            : null;

                        if (!member || !user) {
                            return null;
                        }

                        const reactions = await populateReactions(
                            ctx,
                            message._id
                        );
                        const thread = await populateThread(ctx, message._id);
                        const image = message.image
                            ? await ctx.storage.getUrl(message.image)
                            : undefined;

                        const dedupedReactions = reactions.reduce(
                            (acc, reaction) => {
                                const existingReaction = acc.find(
                                    (r) => r.value === reaction.value
                                );

                                if (existingReaction) {
                                    existingReaction.memberIds = Array.from(
                                        new Set([
                                            ...existingReaction.memberIds,
                                            reaction.memberId,
                                        ])
                                    );
                                } else {
                                    acc.push({
                                        ...reaction,
                                        memberIds: [reaction.memberId],
                                    });
                                }

                                return acc;
                            },
                            [] as (Doc<"reactions"> & {
                                memberIds: Id<"members">[];
                            })[]
                        );

                        const reactionsWithoutMemberId = dedupedReactions.map(
                            ({ memberId, ...rest }) => ({
                                ...rest,
                                count: rest.memberIds.length,
                            })
                        );

                        return {
                            ...message,
                            image,
                            member,
                            user,
                            reactions: reactionsWithoutMemberId,
                            threadCount: thread.count,
                            threadImage: thread.image,
                            threadTimestamp: thread.timestamp,
                        };
                    })
                )
            ).filter((message) => message !== null),
        };
    },
});

export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
    },
    handler: async (
        ctx,
        { body, image, workspaceId, channelId, conversationId, parentMessageId }
    ) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        const member = await getMember(ctx, workspaceId, userId);

        if (!member) {
            throw new ConvexError("Unauthorized");
        }

        let _conversationId = conversationId;

        // Only possible if we are replying in a thread in 1:1 conversation
        if (!conversationId && !channelId && parentMessageId) {
            const parentMessage = await ctx.db.get(parentMessageId);

            if (!parentMessage) {
                throw new ConvexError("Parent message not found");
            }

            _conversationId = parentMessage.conversationId;
        }

        const messageId = await ctx.db.insert("messages", {
            body,
            image,
            channelId,
            workspaceId,
            parentMessageId,
            memberId: member._id,
            conversationId: _conversationId,
        });

        return messageId;
    },
});
