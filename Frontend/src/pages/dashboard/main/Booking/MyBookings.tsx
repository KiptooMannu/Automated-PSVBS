

// const MyBookings = () => {
//   return (
//     <div>MyBookings</div>
//   )
// }

// export default MyBookings

import { useGetUserBookingQuery } from "../../../../features/booking/bookingAPI";
import { useState } from "react";
import { format } from "date-fns";

function MyBookings() {
  const [bookingId, setBookingId] = useState<number>(1); // Set a default ID or get it dynamically
  const { data: booking, error, isLoading } = useGetUserBookingQuery(bookingId);

  console.log("Booking:", booking);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // Function to format ISO date strings
  const formatDate = (isoDate: string | number | Date) =>
    format(new Date(isoDate), "MM/dd/yyyy HH:mm:ss");

  return (
    <div className="overflow-x-auto bg-gradient-to-r from-blue-50  via-blue-100 to-white min-h-screen shadow-lg ">
      <h2 className="text-center text-xl p-4 font-bold text-blue-600">
        Booking Details
      </h2>

      {/* Loading and Error States */}
      {isLoading && <div className="text-center text-red-600">Loading...</div>}
      {error && (
        <div className="text-center text-red-500">
          Error fetching booking: {(error as any).message || "Unknown error"}
        </div>
      )}

      {/* No Booking Found State */}
      {booking === undefined && (
        <div className="text-center text-gray-600">Booking not found</div>
      )}

      {/* Booking Details */}
      {booking && booking.length > 0 && (
  <div className="text-center text-white">
    <p><strong>Booking ID:</strong> {booking[0].booking_id}</p>
    <p><strong>User ID:</strong> {booking[0].user_id}</p>
    <p><strong>Seat ID:</strong> {booking[0].seat_id}</p>
    <p><strong>Departure:</strong> {booking[0].departure}</p>
    <p><strong>Destination:</strong> {booking[0].destination}</p>
    <p><strong>Booking Date:</strong> {formatDate(booking[0].booking_date)}</p>
    <p><strong>Status:</strong> {booking[0].booking_status}</p>
  </div>
)}
    </div>
  );
}

export default MyBookings;
