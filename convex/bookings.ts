import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 1. Fetch bookings for a specific month
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

    // Returns a count per date: { "2026-01-21": 1, "2026-01-22": 3 }
    const stats: Record<string, number> = {};
    for (const booking of bookings) {
      stats[booking.date] = (stats[booking.date] || 0) + 1;
    }
    return stats;
  },
});

/**
 * 2. Check specific time slots for a single day
 */
export const getAvailableSlots = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const dayBookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    const takenSlots = dayBookings.map((b) => b.slot);
    const allSlots = ["9:00 AM", "1:00 PM", "4:00 PM"];

    return allSlots.map((slot) => ({
      time: slot,
      isAvailable: !takenSlots.includes(slot),
    }));
  },
});

/**
 * 3. Create a new booking
 */
export const createBooking = mutation({
  args: {
    name: v.string(),
    facebookName: v.string(),
    phone: v.string(),
    email: v.string(),
    date: v.string(),
    slot: v.string(),
    imageStorageId: v.id("_storage"), // Required as per your request
  },
  handler: async (ctx, args) => {
    // Safety Check: Ensure slot wasn't taken while user was filling the form
    const existing = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date).eq("slot", args.slot))
      .unique();

    if (existing) {
      throw new Error("This slot was just booked by someone else!");
    }

    return await ctx.db.insert("bookings", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * 4. Generate URL for Nail Art upload
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});