import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Get promo status and image URL for the client & admin
export const getPromoSettings = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("adminConfig").first();
    if (!config) return { promoActive: false, imageUrl: null };

    let imageUrl = null;
    if (config.promoImageStorageId) {
      imageUrl = await ctx.storage.getUrl(config.promoImageStorageId);
    }

    return {
      promoActive: config.promoActive ?? false,
      promoImageStorageId: config.promoImageStorageId ?? null,
      imageUrl,
    };
  },
});

// 2. Generate upload URL for admin to upload a new promo poster
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// 3. Update active status and/or image storage ID from admin panel
export const updatePromoSettings = mutation({
  args: {
    promoActive: v.optional(v.boolean()),
    promoImageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("adminConfig").first();
    
    if (!config) {
      // Fallback if adminConfig hasn't been initialized yet
      throw new Error("Admin configuration not found. Please set up admin configuration first.");
    }

    const updates = {};
    if (args.promoActive !== undefined) updates.promoActive = args.promoActive;
    if (args.promoImageStorageId !== undefined) updates.promoImageStorageId = args.promoImageStorageId;

    await ctx.db.patch(config._id, updates);
  },
});