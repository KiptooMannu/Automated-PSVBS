import { Context } from "hono";
import {
  createVehicleService,
  getAllVehiclesService,
  getVehicleByRegNumber,
  updateVehicleService,
  deleteVehicleService,
  checkVehicleExistsService,
} from "./vehicle.services";

// Insert vehicle
export const insertVehicle = async (c: Context) => {
  try {
    const vehicle = await c.req.json();
    const existingVehicle = await checkVehicleExistsService(
      vehicle.registration_number,
      vehicle.license_plate
    );
    if (existingVehicle) {
      return c.json(
        { success: false, error: "Vehicle with the same registration number or license plate already exists" },
        400
      );
    }
    const createdVehicle = await createVehicleService(vehicle);
    return c.json({ success: true, data: createdVehicle }, 201);
  } catch (error: any) {
    console.error("Error inserting vehicle:", error);
    return c.json({ success: false, error: error.message }, 400);
  }
};

// Get all vehicles
export const listAllVehicles = async (c: Context) => {
  try {
    const vehicles = await getAllVehiclesService();
    if (!vehicles || vehicles.length === 0) {
      return c.json({ success: false, error: "No vehicles found" }, 404);
    }
    return c.json({ success: true, data: vehicles }, 200);
  } catch (error: any) {
    console.error("Error fetching vehicles:", error);
    return c.json({ success: false, error: "Error while fetching vehicles" }, 400);
  }
};

// Update vehicle by registration number
export const updateVehicleByRegNo = async (c: Context) => {
  try {
    const reg_no = c.req.param("registration_number");
    const vehicle = await c.req.json();
    if (!reg_no) {
      return c.json({ success: false, error: "Invalid registration number" }, 400);
    }
    const existingVehicle = await checkVehicleExistsService(
      vehicle.registration_number,
      vehicle.license_plate
    );
    if (existingVehicle && existingVehicle.registration_number !== reg_no) {
      return c.json(
        { success: false, error: "Vehicle with the same registration number or license plate already exists" },
        400
      );
    }
    const updatedVehicle = await updateVehicleService(reg_no, vehicle);
    return c.json({ success: true, data: updatedVehicle }, 200);
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    return c.json({ success: false, error: error.message }, 400);
  }
};

// Get vehicle by registration number
export const getAllVehicleByRegNo = async (c: Context) => {
  try {
    const reg_no = c.req.param("registration_number");
    if (!reg_no) {
      return c.json({ success: false, error: "Invalid registration number" }, 400);
    }
    const vehicle = await getVehicleByRegNumber(reg_no);
    if (!vehicle) {
      return c.json({ success: false, error: "No vehicle found with this registration number" }, 404);
    }
    return c.json({ success: true, data: vehicle }, 200);
  } catch (error: any) {
    console.error("Error fetching vehicle:", error);
    return c.json({ success: false, error: error.message }, 400);
  }
};

// Delete vehicle by registration number
export const deleteVehicleByRegNo = async (c: Context) => {
  try {
    const reg_no = c.req.param("registration_number");
    if (!reg_no) {
      return c.json({ success: false, error: "Invalid registration number" }, 400);
    }
    const existingVehicle = await getVehicleByRegNumber(reg_no);
    if (!existingVehicle) {
      return c.json({ success: false, error: "No vehicle found with this registration number" }, 404);
    }
    await deleteVehicleService(reg_no);
    return c.json({ success: true, message: "Vehicle deleted successfully" }, 200);
  } catch (error: any) {
    console.error("Error deleting vehicle:", error);
    return c.json({ success: false, error: error.message }, 400);
  }
};