import { Context } from "hono";
import { getSchedules, createSchedule, getScheduleById, updateSchedule, deleteSchedule } from "./Schedules.service";
// import { scheduleSchema } from "./";

// Get all schedules
export const getAllSchedules = async (c: Context) => {
  try {
    const schedules = await getSchedules();
    return c.json({ success: true, data: schedules });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Get a schedule by ID
export const getSchedule = async (c: Context) => {
  const scheduleId = c.req.param("scheduleId");
  try {
    const schedule = await getScheduleById(parseInt(scheduleId));
    if (!schedule) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }
    return c.json({ success: true, data: schedule });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Create a new schedule
export const addSchedule = async (c: Context) => {
  const scheduleData = await c.req.json();
  try {
    const newSchedule = await createSchedule(scheduleData);
    return c.json({ success: true, data: newSchedule }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Update a schedule
export const modifySchedule = async (c: Context) => {
  const scheduleId = c.req.param("scheduleId");
  const scheduleData = await c.req.json();
  try {
    const updatedSchedule = await updateSchedule(parseInt(scheduleId), scheduleData);
    if (!updatedSchedule) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }
    return c.json({ success: true, data: updatedSchedule });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Delete a schedule
export const removeSchedule = async (c: Context) => {
  const scheduleId = c.req.param("scheduleId");
  try {
    await deleteSchedule(parseInt(scheduleId));
    return c.json({ success: true, message: "Schedule deleted successfully" });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};