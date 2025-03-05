import { useGetUserBookingQuery, useUpdateBookingVehicleMutation } from "../../../../features/booking/bookingAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { format } from "date-fns";
import { toast } from "sonner";

function MyBookings() {
  const user = useSelector((state: RootState) => state.user);
  const userId = user.user?.user_id ?? 0; 

  const { data: booking, error, isLoading, refetch } = useGetUserBookingQuery(userId);
  const [updateBooking] = useUpdateBookingVehicleMutation();

  const formatDate = (isoDate: string | number | Date | null | undefined) => {
    if (!isoDate) return "N/A"; // Handle missing dates
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "Invalid Date" : format(date, "MM/dd/yyyy HH:mm:ss");
  };

  const handleCancelBooking = async (bookingId: number) => {
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
  };

  return (
    <div className="bg-slate-200 min-h-screen">
      <div className="mx-auto bg-slate-200 w-full rounded-md mb-5 border-2">
        <h2 className="text-center text-xl p-2 rounded-t-md text-webcolor font-bold">My Booking History</h2>

        {/* Loading State */}
        {isLoading && <div className="text-center text-gray-600">Loading...</div>}

        {/* Error State */}
        {error && <div className="text-center text-red-500">Error loading bookings</div>}

        {/* No Booking Found State */}
        {!isLoading && !error && (!booking || booking.length === 0) && (
          <div className="text-center text-gray-600">No bookings found</div>
        )}

        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="px-4 py-2 text-left text-text-light">Booking ID</th>
                <th className="px-4 py-2 text-left text-text-light">Vehicle ID</th>
                <th className="px-4 py-2 text-left text-text-light">User ID</th>
                <th className="px-4 py-2 text-left text-text-light">Seats ID</th>
                <th className="px-4 py-2 text-left text-text-light">Booking Date</th>
                <th className="px-4 py-2 text-left text-text-light">Return Date</th>
                <th className="px-4 py-2 text-left text-text-light">Total Amount</th>
                <th className="px-4 py-2 text-left text-text-light">Booking Status</th>
                <th className="px-4 py-2 text-left text-text-light">Action</th>
              </tr>
            </thead>
            <tbody>
              {(booking || []).map((booking) => (
                <tr key={booking.booking_id} className="border-b border-slate-600">
                  <td className="px-4 py-2">{booking.booking_id}</td>
                  <td className="px-4 py-2">{booking.vehicle_id}</td>
                  <td className="px-4 py-2">{booking.user_id}</td>
                  <td className="px-4 py-2">{booking.seat_ids}</td>
                  <td className="px-4 py-2">{formatDate(booking.booking_date)}</td>
                  <td className="px-4 py-2">
                    {booking.vehicle ? formatDate(booking.vehicle.departure_time) : "N/A"}
                  </td>
                  <td className="px-4 py-2">{booking.total_price}</td>
                  <td className="px-4 py-2">{booking.booking_status}</td>
                  <td className="px-4 py-2">
                    {booking.booking_status === "pending" && (
                      <button
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
      </div>
    </div>
  );
}

export default MyBookings;