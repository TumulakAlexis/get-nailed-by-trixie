import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 1. Fetch ALL bookings
 * Used by the Admin Calendar and Modal to list daily schedules
 */
export const getAllBookings = query({
  args: {},
  handler: async (ctx) => {
    // Fetches everything and sorts by date
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

/**
 * 2. Fetch Signed Image URL
 * Converts the storage ID into a viewable link for Trixie
 */
export const getImageUrl = query({
  args: { storageId: v.union(v.id("_storage"), v.null()) },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * 3. Fetch bookings for a specific month
 * Used to determine the Red/Green dots on the calendar
 */
export const getMonthAvailability = query({
  args: { month: v.string() }, // Expected: "2026-01"
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) =>
        q.gte("date", `${args.month}-01`).lte("date", `${args.month}-31`)
      )
      .collect();

    const stats = {};
    for (const booking of bookings) {
      stats[booking.date] = (stats[booking.date] || 0) + 1;
    }
    return stats;
  },
});

/**
 * 4. Check specific time slots for a single day
 */
export const getAvailableSlots = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const dayBookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    // Only count active bookings as "taken"
    const takenSlots = dayBookings
      .filter(b => b.status === "active" || !b.status)
      .map((b) => b.slot);
      
    const allSlots = ["9:00 AM", "1:00 PM", "4:00 PM"];

    return allSlots.map((slot) => ({
      time: slot,
      isAvailable: !takenSlots.includes(slot),
    }));
  },
});

/**
 * 5. Create a new booking
 */
export const createBooking = mutation({
  args: {
    name: v.string(),
    facebookName: v.string(),
    phone: v.string(),
    email: v.string(),
    date: v.string(),
    slot: v.string(),
    imageStorageId: v.union(v.id("_storage"), v.null()), 
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date).eq("slot", args.slot))
      .unique();

    // Check if slot is truly taken by an active booking
    if (existing && (existing.status === "active" || !existing.status)) {
      throw new Error("This slot was just booked by someone else!");
    }

    return await ctx.db.insert("bookings", {
      ...args,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

/**
 * 6. Generate URL for Nail Art upload
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});