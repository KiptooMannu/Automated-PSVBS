import { useGetBookingVehicleQuery } from "../../../../features/booking/bookingAPI";
import { format } from "date-fns";

function AllBookings() {
  const { data: allBookings, error, isLoading } = useGetBookingVehicleQuery();

  // Debugging: Log the data to inspect its structure
  console.log("All Bookings:", allBookings);

  const formatDate = (isoDate: string | number | Date) =>
    format(new Date(isoDate), "MM/dd/yyyy ");

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-center text-gray-900 py-6 bg-gray-100">
          All Bookings
        </h2>

        {isLoading && <div className="text-center text-yellow-400 py-8">Loading...</div>}

        {error && (
          <div className="text-center text-red-500 py-8">
            {(error as { data?: { message: string } })?.data?.message || "An error occurred. Please try again."}
          </div>
        )}

        {allBookings && allBookings.length === 0 && (
          <div className="text-center text-gray-400 py-8">No bookings found</div>
        )}

        {allBookings && allBookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">Booking ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">User ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">Seat ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">Departure</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">Destination</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">Departure Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">Booking Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium uppercase">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allBookings.map((booking) => (
                  <tr key={booking.booking_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.booking_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.user_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.seat_ids ? String(booking.seat_ids).split(",").join(", ") : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.departure}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.destination}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(booking.departure_date)} {booking.departure_time && `at ${booking.departure_time}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.booking_status === "confirmed" || booking.booking_status === "completed"
                            ? "bg-green-100 text-green-800" // Green for confirmed and completed
                            : booking.booking_status === "pending"
                            ? "bg-yellow-100 text-yellow-800" // Yellow for pending
                            : "bg-red-100 text-red-800" // Red for cancelled or other statuses
                        }`}
                      >
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.payment_status === "completed"
                            ? "bg-green-100 text-green-800" // Green for completed
                            : booking.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800" // Yellow for pending
                            : "bg-red-100 text-red-800" // Red for failed or other statuses
                        }`}
                      >
                        {booking.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllBookings;