import { Hono } from "hono";
import {
  getAllSchedules,
  getSchedule,
  addSchedule,
  modifySchedule,
  removeSchedule,
} from "./Schedules.controller";

const scheduleRouter = new Hono();

// Get all schedules
scheduleRouter.get("/", getAllSchedules);

// Get a schedule by ID
scheduleRouter.get("/:scheduleId", getSchedule);

// Create a new schedule
scheduleRouter.post("/", addSchedule);

// Update a schedule
scheduleRouter.put("/:scheduleId", modifySchedule);

// Delete a schedule
scheduleRouter.delete("/:scheduleId", removeSchedule);

export default scheduleRouter;