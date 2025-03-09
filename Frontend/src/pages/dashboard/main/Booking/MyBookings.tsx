import { useGetUserBookingQuery, useUpdateBookingVehicleMutation } from "../../../../features/booking/bookingAPI";
import { useGetBookingVehicleQuery } from "../../../../features/booking/bookingAPI"; // Import the second query
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { format } from "date-fns";
import { toast } from "sonner";

function MyBookings() {
  const user = useSelector((state: RootState) => state.user);
  const userId = user.user?.user_id ?? 0;

  // Fetch user bookings (excluding seat_ids)
  const { data: userBookings, error, isLoading, refetch } = useGetUserBookingQuery(userId);

  // Fetch all bookings (to get seat_ids)
  const { data: allBookings } = useGetBookingVehicleQuery();

  const [updateBooking] = useUpdateBookingVehicleMutation();

  // Debugging: Log the data to inspect its structure
  console.log("User Bookings:", userBookings);
  console.log("All Bookings:", allBookings);

  const formatDate = (isoDate: string | number | Date | null | undefined) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "Invalid Date" : format(date, "MM/dd/yyyy HH:mm:ss");
  };

  // Function to get seat_ids for a specific booking_id
  const getSeatIds = (bookingId: number) => {
    const booking = allBookings?.find((b) => b.booking_id === bookingId);
    return booking?.seat_ids ? String(booking.seat_ids).split(",").join(", ") : "N/A";
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await updateBooking({
          booking_id: bookingId,
          booking_status: "cancelled",
        }).unwrap();
        toast.success("Booking cancelled successfully");
        refetch(); // Refresh the data
      } catch (error) {
        toast.error("Failed to cancel booking");
        console.error("Error:", error);
      }
    }
  };

  if (isLoading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading bookings: {error.toString()}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-bold text-center text-black py-2 rounded-t-sm">
          My Booking History
        </h2>

        {!userBookings || userBookings.length === 0 ? (
          <div className="text-center text-gray-600 py-6">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Booking ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">User ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Seats ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Booking Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Departure Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Total Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Booking Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Payment Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userBookings.map((booking) => (
                  <tr key={booking.booking_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.booking_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.vehicle_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.user_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getSeatIds(booking.booking_id)} {/* Fetch seat_ids from allBookings */}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(booking.booking_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(booking.departure_date)} {booking.departure_time && `at ${booking.departure_time}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">${booking.total_price}</td>

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
                        {booking.payment_status || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {booking.booking_status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking.booking_id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                          aria-label="Cancel booking"
                        >
                          Cancel
                        </button>
                      )}
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

export default MyBookings;