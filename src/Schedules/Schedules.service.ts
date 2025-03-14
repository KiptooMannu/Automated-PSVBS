import db from "../drizzle/db";
import { scheduleTable } from "../../src/drizzle/schema";
import { eq } from "drizzle-orm";

// Get all schedules
export const getSchedules = async () => {
  return await db.query.scheduleTable.findMany();
};

// Get a schedule by ID
export const getScheduleById = async (scheduleId: number) => {
  return await db.query.scheduleTable.findFirst({
    where: eq(scheduleTable.schedule_id, scheduleId),
  });
};

// Create a new schedule
export const createSchedule = async (scheduleData: typeof scheduleTable.$inferInsert) => {
  const [newSchedule] = await db.insert(scheduleTable).values(scheduleData).returning();
  return newSchedule;
};

// Update a schedule
export const updateSchedule = async (scheduleId: number, scheduleData: Partial<typeof scheduleTable.$inferInsert>) => {
  const [updatedSchedule] = await db
    .update(scheduleTable)
    .set(scheduleData)
    .where(eq(scheduleTable.schedule_id, scheduleId))
    .returning();
  return updatedSchedule;
};

// Delete a schedule
export const deleteSchedule = async (scheduleId: number) => {
  await db.delete(scheduleTable).where(eq(scheduleTable.schedule_id, scheduleId));
};