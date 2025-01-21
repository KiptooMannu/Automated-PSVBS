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
    <div className="overflow-x-auto bg-gradient-to-r from-blue-50  via-blue-100 to-white min-h-screen shadow-lg">
      <h2 className="text-center text-3xl font-semibold text-gray-800 my-8 drop-shadow-lg">
        All Tickets
      </h2>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center text-gray-500 text-lg">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-500 text-lg">
          Error fetching tickets: {(error as any).message || "Unknown error"}
        </div>
      )}

      {/* No Tickets State */}
      {bookings && bookings.length === 0 && (
        <div className="text-center text-gray-600 text-lg">No tickets found</div>
      )}

      {/* Tickets Table */}
      {bookings && bookings.length > 0 && (
        <table className="table-auto w-full border-collapse mt-8 shadow-xl bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md">
              <th className="border-b px-6 py-4 text-left text-sm font-medium">
                Ticket ID
              </th>
              <th className="border-b px-6 py-4 text-left text-sm font-medium">
                User ID
              </th>
              <th className="border-b px-6 py-4 text-left text-sm font-medium">
                Status
              </th>
              <th className="border-b px-6 py-4 text-left text-sm font-medium">
                Subject
              </th>
              <th className="border-b px-6 py-4 text-left text-sm font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 shadow-sm"
              >
                <td className="border-b px-6 py-4 text-sm">{ticket.ticket_id}</td>
                <td className="border-b px-6 py-4 text-sm">{ticket.user_id}</td>
                <td className="border-b px-6 py-4 text-sm">{ticket.status}</td>
                <td className="border-b px-6 py-4 text-sm">{ticket.subject}</td>
                <td className="border-b px-6 py-4 text-sm">{ticket.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllTickets;
