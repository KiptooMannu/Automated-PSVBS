import { useGetTicketByIdQuery } from "../../../../features/tickets/ticketsAPI";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

// Badge component for status
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusColors: { [key: string]: string } = {
    Paid: "bg-green-500 text-white",
    Pending: "bg-yellow-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || "bg-gray-500 text-white"}`}>
      {status || "Unknown"}
    </span>
  );
};

const Tickets: React.FC<{ ticket_id: number }> = ({ ticket_id }) => {
  const { data: ticket, error, isLoading } = useGetTicketByIdQuery(ticket_id);

  // Helper function to format ISO date strings
  const formatDate = (isoDate: string | number | Date) =>
    format(new Date(isoDate), "MM/dd/yyyy HH:mm:ss");

  // Handle loading state
  if (isLoading) return <p>Loading ticket...</p>;

  // Handle error state
  if (error || !ticket) {
    const errorMessage = (error as any)?.data?.message || "Failed to fetch ticket.";
    return (
      <p className="text-red-600">
        {errorMessage}
      </p>
    );
  }

  // Render ticket details
  return (
    <div className="border p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
      <div>
        <h2 className="font-bold text-lg">Ticket ID: {ticket.ticket_id}</h2>
        <p>User: {ticket.user_id}</p>
        <p>Created At: {formatDate(ticket.created_at)}</p>
        <p>Updated At: {formatDate(ticket.updated_at)}</p>
        <p>Subject: {ticket.subject}</p>
        <p>Description: {ticket.description}</p>
        <p>
          Status: <StatusBadge status={ticket.status} />
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Download Ticket
        </button>
        {ticket.status === "Pending" && (
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
            Pay Now
          </button>
        )}
        {/* Use NavLink to navigate to the Cancel Ticket page */}
        <NavLink
          to="/dashboard/tickets"
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cancel Ticket
        </NavLink>
      </div>
    </div>
  );
};

export default Tickets;
