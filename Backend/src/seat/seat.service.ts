// import  db  from "../drizzle/db";
// import { seatTable,TISeats,TSSeats } from "../drizzle/schema";
// import { eq } from "drizzle-orm";


// // Get all seats
// export const getAllSeatsService = async (): Promise<TSSeats[]> => {
//   const seats = await db.query.seatTable.findMany();
//   return seats ?? []; // Ensure it always returns an array
// };


// // Get seat by ID
// export const getSeatByIdService = async (seat_id: number): Promise<TSSeats | undefined> => {
//   const seat = await db.query.seatTable.findFirst({
//     where: eq(seatTable.seat_id, seat_id),
//   });
//   return seat;
// };

// // Create seat
// export const createSeatService = async (seat: TISeats): Promise<string> => {
//   await db.insert(seatTable).values(seat);
//   return "Seat created successfully";
// };

// // Update seat
// export const updateSeatService = async (seat_id: number, seat: TISeats): Promise<string> => {
//   await db.update(seatTable).set(seat).where(eq(seatTable.seat_id, seat_id));
//   return "Seat updated successfully";
// };

// // Delete seat
// export const deleteSeatService = async (seat_id: number): Promise<string> => {
//   await db.delete(seatTable).where(eq(seatTable.seat_id, seat_id));
//   return "Seat deleted successfully";
// };

// // Get seats by vehicle ID
// export const getSeatByVehicleIdService = async (vehicle_id: string): Promise<TSSeats[]> => {
//   return await db.query.seatTable.findMany({
//       where: eq(seatTable.vehicle_id, vehicle_id),
//   });
// };