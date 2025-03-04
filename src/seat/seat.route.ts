// import { Context, Hono, Next } from "hono";

// import {
//     insertVehicleController,
//     listAllSeatsController,
//     getSeatByIdController,
//     updateSeatByIdController,
//     deleteSeatByIdController,
//     getSeatByVehicleIdController
// } from "./seat.controller";

// const seatRouter = new Hono();

// seatRouter
//     .get("/seats", listAllSeatsController)
//     .get("/seats/:seat_id", getSeatByIdController)
//     .post("/seats", insertVehicleController)
//     .put("/seats/:seat_id", updateSeatByIdController)
//     .delete("/seats/:seat_id", deleteSeatByIdController)
//     .get("/seat/:vehicle_id", getSeatByVehicleIdController);// need fixes because of registration_number

// export default seatRouter;