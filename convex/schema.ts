// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bookings: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    facebookName: v.string(),
    date: v.string(), // We will index this
    slot: v.string(), // And this
    createdAt: v.float64(),
    imageStorageId: v.union(v.id("_storage"), v.null()), 
    status: v.optional(v.string()),
  })
  // ADD THIS LINE BELOW TO FIX THE ERROR
  .index("by_date", ["date", "slot"]), 
});