import { useGetBookingVehicleQuery } from "../../../../features/booking/bookingAPI";
import { format } from "date-fns";

function AllBookings() {
  const { data, error, isLoading } = useGetBookingVehicleQuery();

  const formatDate = (isoDate: string | number | Date) =>
    format(new Date(isoDate), "MM/dd/yyyy HH:mm:ss");

  return (
    <div className="overflow-x-auto bg-gradient-to-r from-blue-50 via-blue-100 to-white min-h-screen shadow-lg">
      <h2 className="text-center text-xl p-4 font-bold text-blue-600">All Bookings</h2>

      {isLoading && <div className="text-center text-yellow-400">Loading...</div>}

      {error && (
        <div className="text-center text-red-500">
          {(error as { data?: { message: string } })?.data?.message || "An error occurred. Please try again."}
        </div>
      )}

      {data && data.length === 0 && (
        <div className="text-center text-gray-400">No bookings found</div>
      )}

      {data && data.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-blue-950 text-white">
              <th className="border border-gray-400 px-4 py-2">Booking ID</th>
              <th className="border border-gray-400 px-4 py-2">User ID</th>
              <th className="border border-gray-400 px-4 py-2">Seat ID</th>
              <th className="border border-gray-400 px-4 py-2">Departure</th>
              <th className="border border-gray-400 px-4 py-2">Destination</th>
              <th className="border border-gray-400 px-4 py-2">Departure Date</th>
              <th className="border border-gray-400 px-4 py-2">Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => (
              <tr key={booking.booking_id} className="text-center">
                <td className="border border-gray-400 px-4 py-2">{booking.booking_id}</td>
                <td className="border border-gray-400 px-4 py-2">{booking.user_id}</td>
                <td className="border border-gray-400 px-4 py-2">
                  {booking.seat_ids ? String(booking.seat_ids).split(",").join(", ") : "N/A"}
                </td>
                <td className="border border-gray-400 px-4 py-2">{booking.departure}</td>
                <td className="border border-gray-400 px-4 py-2">{booking.destination}</td>
                <td className="border border-gray-400 px-4 py-2">{formatDate(booking.departure_date)}</td>
                <td className="border border-gray-400 px-4 py-2">{booking.booking_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllBookings;