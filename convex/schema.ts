import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bookings: defineTable({
    name: v.string(),
    facebookName: v.string(),
    phone: v.string(),
    email: v.string(),
    date: v.string(), // "YYYY-MM-DD"
    slot: v.string(), // "9:00 AM"
    status: v.optional(v.string()),
    imageStorageId: v.union(v.id("_storage"), v.null()),
    createdAt: v.number(),
  }).index("by_date", ["date", "slot"]),

  // --- ADDED TABLES ---
  
  transactions: defineTable({
    name: v.string(),
    phone: v.string(),
    services: v.array(v.string()),
    additionalFee: v.number(),
    totalFee: v.number(),
    date: v.string(), // Important for revenue filtering
    createdAt: v.number(),
  }),

  expenses: defineTable({
    description: v.string(),
    amount: v.number(),
    category: v.string(), // "Supplies", "Rent", etc.
    date: v.string(), // "YYYY-MM-DD"
    createdAt: v.number(),
  }),
});