// import { Context } from "hono";
// import {
//     getAllSeatsService,
//     getSeatByIdService,
//     createSeatService,
//     updateSeatService,
//     deleteSeatService,
//     getSeatByVehicleIdService
// } from "./seat.service";

// // Create a seat
// export const createSeatController = async (c: Context) => {
//     try {
//         const seat = await c.req.json();
//         const createdSeat = await createSeatService(seat);
//         if (!createdSeat) return c.json({ msg: "Seat not created 😒" }, 400);
//         return c.json(createdSeat, 201);
//     } catch (error: any) {
//         return c.json({ msg: error?.message || "Error creating seat" }, 500);
//     }
// };

// // Get all seats
// export const listAllSeatsController = async (c: Context) => {
//     try {
//         const seats = await getAllSeatsService();
//         if (!seats.length) return c.json({ msg: "No seats found 😒" }, 404);
//         return c.json(seats, 200);
//     } catch (error: any) {
//         return c.json({ msg: "Error while fetching seats 😒" }, 500);
//     }
// };

// // Get seat by ID
// export const getSeatByIdController = async (c: Context) => {
//     try {
//         const seat_id = Number(c.req.param("seat_id"));
//         if (isNaN(seat_id)) return c.json({ msg: "Invalid seat ID" }, 400);

//         const seat = await getSeatByIdService(seat_id);
//         if (!seat) return c.json({ msg: "No seat found for this ID 😒" }, 404);

//         return c.json(seat, 200);
//     } catch (error: any) {
//         return c.json({ msg: "Error while fetching seat by ID 😒" }, 500);
//     }
// };

// // Update seat by ID
// export const updateSeatByIdController = async (c: Context) => {
//     try {
//         const seat_id = Number(c.req.param("seat_id"));
//         if (isNaN(seat_id)) return c.json({ msg: "Invalid Seat ID" }, 400);

//         const seatData = await c.req.json();
//         const updatedSeat = await updateSeatService(seat_id, seatData);

//         if (!updatedSeat) return c.json({ msg: "Seat not updated 😒" }, 400);
//         return c.json({ msg: "Seat updated successfully", seat: updatedSeat }, 200);
//     } catch (error: any) {
//         return c.json({ msg: "Error updating seat 😒", error: error.message || error }, 500);
//     }
// };

// // Delete seat by ID
// export const deleteSeatByIdController = async (c: Context) => {
//     try {
//         const seat_id = Number(c.req.param("seat_id"));
//         if (isNaN(seat_id)) return c.json({ msg: "Invalid seat ID 😒" }, 400);

//         const deletedSeat = await deleteSeatService(seat_id);
//         if (!deletedSeat) return c.json({ msg: "Seat not deleted 😒" }, 400);

//         return c.json({ msg: "Seat deleted successfully" }, 200);
//     } catch (error: any) {
//         return c.json({ msg: error?.message || "Error deleting seat 😒" }, 500);
//     }
// };

// // Get seats by vehicle ID
// export const getSeatByVehicleIdController = async (c: Context) => {
//     try {
//         const vehicle_id = c.req.param("vehicle_id");
//         if (!vehicle_id) return c.json({ msg: "Invalid vehicle ID" }, 400);

//         const seats = await getSeatByVehicleIdService(vehicle_id);
//         if (!seats.length) return c.json({ msg: "No seats found for this vehicle ID 😒" }, 404);

//         return c.json(seats, 200);
//     } catch (error: any) {
//         return c.json({ msg: "Error while fetching seats by vehicle ID 😒" }, 500);
//     }
// };
