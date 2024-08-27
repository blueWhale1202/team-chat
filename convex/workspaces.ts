import { getAuthUserId } from "@convex-dev/auth/server";

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { generate } from "referral-codes";

export const getList = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            return [];
        }

        const members = await ctx.db
            .query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();

        const workspaces = [];

        for (const member of members) {
            const workspace = await ctx.db.get(member.workspaceId);

            if (workspace) {
                workspaces.push(workspace);
            }
        }

        return workspaces;
    },
});

export const getById = query({
    args: {
        id: v.id("workspaces"),
    },
    handler: async (ctx, { id }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", id)
            )
            .unique();

        if (!member) {
            return null;
        }

        return await ctx.db.get(id);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, { name }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        const [joinCode] = generate({ length: 8 });

        const workspaceId = await ctx.db.insert("workspaces", {
            name,
            userId,
            joinCode,
        });

        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "admin",
        });

        return workspaceId;
    },
});

export const update = mutation({
    args: {
        id: v.id("workspaces"),
        name: v.string(),
    },
    handler: async (ctx, { id, name }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", id)
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new ConvexError("Unauthorized");
        }

        await ctx.db.patch(id, { name });

        return id;
    },
});

export const remove = mutation({
    args: {
        id: v.id("workspaces"),
    },
    handler: async (ctx, { id }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", id)
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new ConvexError("Unauthorized");
        }

        const [members] = await Promise.all([
            ctx.db
                .query("members")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
                .collect(),
        ]);

        console.log("🚀 ~ handler: ~ members:", members);

        for (const member of members) {
            await ctx.db.delete(member._id);
        }

        await ctx.db.delete(id);

        return id;
    },
});
