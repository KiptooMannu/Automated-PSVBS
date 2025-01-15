// import React from "react";

// // Define types for ticket data
// interface Ticket {
//   ticketId: string;
//   user: string;
//   tripDate: string;
//   tripTime: string;
//   seat: string[];
//   status: "Paid" | "Pending" | "Cancelled";
//   price: number;
// }

// // Random ticket data
// const tickets: Ticket[] = [
//   {
//     ticketId: "12345",
//     user: "John Doe",
//     tripDate: "2025-01-20",
//     tripTime: "8:00 AM",
//     seat: ["A12", "A13"],
//     status: "Paid",
//     price: 10,
//   },
//   {
//     ticketId: "67890",
//     user: "Jane Smith",
//     tripDate: "2025-01-22",
//     tripTime: "9:30 AM",
//     seat: ["B10"],
//     status: "Pending",
//     price: 8,
//   },
//   {
//     ticketId: "34567",
//     user: "Sam Wilson",
//     tripDate: "2025-01-25",
//     tripTime: "10:00 AM",
//     seat: ["C3", "C4"],
//     status: "Cancelled",
//     price: 12,
//   },
// ];

// // Badge component for status
// const StatusBadge: React.FC<{ status: Ticket["status"] }> = ({ status }) => {
//   const statusColors: { [key in Ticket["status"]]: string } = {
//     Paid: "bg-green-500 text-white",
//     Pending: "bg-yellow-500 text-white",
//     Cancelled: "bg-red-500 text-white",
//   };
//   return (
//     <span
//       className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}
//     >
//       {status}
//     </span>
//   );
// };

// // Ticket Card Component
// const Tickets: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
//   <div className="border p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
//     <div>
//       {/* <h2 className="font-bold text-lg">Ticket ID: {ticket.ticketId}</h2> */}
//       {/* <p>User: {ticket.user}</p> */}
//       <p>Trip: {ticket.tripDate} at {ticket.tripTime}</p>
//       <p>Seat(s): {ticket.seat.join(", ")}</p>
//       <p>Price: ${ticket.price}</p>
//       <p>
//         Status: <StatusBadge status={ticket.status} />
//       </p>
//     </div>
//     <div className="flex flex-col gap-2">
//       <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
//         Download Ticket
//       </button>
//       {ticket.status === "Pending" && (
//         <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
//           Pay Now
//         </button>
//       )}
//       <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
//         Cancel Ticket
//       </button>
//     </div>
//   </div>
// );

// export default Tickets

const Tickets = () => {
  return (
    <div>Tickets</div>
  )
}

export default Tickets