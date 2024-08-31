import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { query, QueryCtx } from "./_generated/server";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
    return await ctx.db.get(id);
};

export const current = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            return null;
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", workspaceId)
            )
            .unique();

        return member;
    },
});

export const getById = query({
    args: { id: v.id("members") },
    handler: async (ctx, { id }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            return null;
        }

        const member = await ctx.db.get(id);

        if (!member) {
            return null;
        }

        const currentMember = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", member.workspaceId)
            );

        if (!currentMember) {
            return null;
        }

        const user = await populateUser(ctx, member.userId);

        if (!user) {
            return null;
        }

        return {
            ...member,
            user,
        };
    },
});

export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            return [];
        }

        const data = await ctx.db
            .query("members")
            .withIndex("by_workspace_id", (q) =>
                q.eq("workspaceId", workspaceId)
            )
            .collect();

        const members = [];

        for (const member of data) {
            const user = await populateUser(ctx, member.userId);

            if (user) {
                members.push({
                    ...member,
                    user,
                });
            }
        }

        return members;
    },
});
