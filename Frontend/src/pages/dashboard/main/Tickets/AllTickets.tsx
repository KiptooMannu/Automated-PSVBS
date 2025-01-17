import { useGetTicketsQuery } from "../../../../features/tickets/ticketsAPI";
import { format } from "date-fns";

function AllTickets() {
  // Fetch all bookings using the API hook
  const { data: bookings, error, isLoading } = useGetTicketsQuery();

  console.log("Bookings:", bookings);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // Function to format ISO date strings
  const formatDate = (isoDate: string | number | Date) =>
    format(new Date(isoDate), "MM/dd/yyyy HH:mm:ss");

  return (
    <div className="overflow-x-auto bg-gray-900 min-h-screen">
      <h2 className="text-center text-xl p-4 font-bold text-blue-600">
        All Tickets
      </h2>

      {/* Loading and Error States */}
      {isLoading && <div className="text-center text-red-600">Loading...</div>}
      {error && (
        <div className="text-center text-red-500">
          Error fetching tickets: {(error as any).message || "Unknown error"}
        </div>
      )}

      {/* No Bookings State */}
      {bookings && bookings.length === 0 && (
        <div className="text-center text-gray-600">Tickets found</div>
      )}

      {/* Bookings Table */}
      {bookings && bookings.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-green-500">
              <th className="border border-gray-400 px-4 py-2">Ticket ID</th>
              <th className="border border-gray-400 px-4 py-2">User ID</th>
              <th className="border border-gray-400 px-4 py-2">Status</th>
              <th className="border border-gray-400 px-4 py-2">Subject</th>
              <th className="border border-gray-400 px-4 py-2">Description</th>
              {/* <th className="border border-gray-400 px-4 py-2">Booking Date</th> */}
              
            </tr>
          </thead>
          <tbody>
            {bookings.map((ticket) => (
              <tr key={ticket.ticket_id} className="text-center">
                <td className="border border-gray-400 px-4 py-2">{ticket.ticket_id}</td>
                <td className="border border-gray-400 px-4 py-2">{ticket.user_id}</td>
                <td className="border border-gray-400 px-4 py-2">{ticket.status}</td>
                <td className="border border-gray-400 px-4 py-2">{ticket.subject}</td>
                <td className="border border-gray-400 px-4 py-2">{ticket.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllTickets;