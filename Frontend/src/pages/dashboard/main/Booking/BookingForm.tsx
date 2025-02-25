import React, { useState , useEffect } from "react";
import { useFetchCarSpecsQuery, Vehicle } from "../../../../features/vehicles/vehicleAPI";
import MapSeatModal from "./MapSeat";

const BookingForm: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<string>(""); // State for filtering by ty
  const [destination, setDestination] = useState<string>(""); // State for filtering by destination
  const [departure, setDeparture] = useState<string>(""); // State for filtering by departure
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Selected vehicle
  const [isMapSeatModalOpen, setIsMapSeatModalOpen] = useState(false); // Modal state


  const { data: vehicles, isLoading, isError, refetch } = useFetchCarSpecsQuery();

  // ✅ Remove duplicate vehicles based on `registration_number`
  const uniqueVehicles = vehicles
    ? Array.from(new Map(vehicles.map(vehicle => [vehicle.registration_number, vehicle])).values())
    : [];
  
  // ✅ Use uniqueVehicles instead of vehicles for filtering and rendering
  const filteredVehicles = uniqueVehicles?.filter((vehicle) => {
    const matchesType = vehicleType
      ? vehicle.vehicle_type?.toLowerCase().includes(vehicleType.toLowerCase())
      : true;
  
    const matchesDeparture = departure
      ? vehicle.departure?.toLowerCase().includes(departure.toLowerCase())
      : true;
    const matchesDestination = destination
      ? vehicle.destination?.toLowerCase().includes(destination.toLowerCase())
      : true;
  
    return matchesType && matchesDeparture && matchesDestination;
  });
  


  // Handle Map Seat Modal
  const handleMapSeatModal = (vehicle: Vehicle) => {
    if (!selectedVehicle || selectedVehicle.registration_number !== vehicle.registration_number) {
      setSelectedVehicle(vehicle); // Ensure only one vehicle is selected
      setIsMapSeatModalOpen(true);
    }
  };
  


  // console.log("Selected Vehicle:", selectedVehicle);
  useEffect(() => {
    console.log("Fetched Vehicles from API:", uniqueVehicles);
  }, [uniqueVehicles]);  // ✅ Use uniqueVehicles instead of vehicles
  
  
 

  if (isLoading)
    return <p className="text-center text-gray-500">Loading vehicles...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load vehicles. Please try again later.</p>;

  return (
    <div className="overflow-x-auto bg-gradient-to-r from-blue-50  via-blue-800 to-white min-h-screen shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-webcolor text-center p-5">Book Now!!!</h1>
      <div className="card lg:w-[100%] m-auto rounded-lg  p-6">
        {/* Search Filters */}
        <form 
        // onSubmit={handleSubmit} 
        className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Departure Location Input */}
            <div className="flex-1">
              <div className="form-control">
                <label htmlFor="destination" className="label">
                  <span className="label-text">Destination</span>
                </label>
                <input
                  id="destination"
                  type="text"
                  placeholder="Search by destination📍"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            </div>
            {/* Destination Input */}
            <div className="flex-1">
              <div className="form-control">
                <label htmlFor="departure" className="label">
                  <span className="label-text">Departure</span>
                </label>
                <input
                  id="departure"
                  type="text"
                  placeholder="Search by departure Location📍"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            </div>

            {/* Vehicle Type Input */}
            <div className="flex-1">
              <div className="form-control">
                <label htmlFor="vehicleType" className="label">
                  <span className="label-text">Vehicle Type</span>
                </label>
                <input
                  id="vehicleType"
                  type="text"
                  placeholder="Search by vehicle type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            </div>
        
          </div>

{/* Vehicle List */}
<div className="space-y-4 p-4">
  {filteredVehicles?.length ? (
    <div className="flex flex-wrap justify-center gap-4">
      {filteredVehicles.map((vehicle, index) => {
        // ✅ Calculate remaining seats (Reserving 1 seat for the driver)
        const remainingSeats = Math.max((vehicle.capacity - 1) - (Number(vehicle.booked_Seats) || 0), 0);

        return (
          <div
            key={`${vehicle.registration_number}-${index}`}
            className={`card w-full sm:w-[45%] lg:w-[23%] bg-blue-200 shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
              selectedVehicle?.registration_number === vehicle.registration_number
                ? "border-2 border-webcolor"
                : "border border-gray-200"
            }`}
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <img
              src={vehicle.image_url}
              alt={vehicle.vehicle_name}
              className="w-full h-16 object-cover rounded-lg mb-4"
            />
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-800 mb-2">
                {vehicle.vehicle_name}
                {/* ✅ Availability Status Based on Remaining Seats */}
                <span
                  className={`ml-4 inline-block px-3 py-0.5 text-xs font-medium rounded ${
                    vehicle.is_active && remainingSeats > 0
                      ? "bg-green-300 text-green-900"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {vehicle.is_active && remainingSeats > 0 ? "Available" : "Unavailable"}
                </span>
              </h3>
              <div className="space-y-1 text-green-900 text-xs">
                <p>Type: {vehicle.vehicle_type}</p>
                <p>Capacity: {vehicle.capacity}</p>
                <p>Booked Seats: {vehicle.booked_Seats || 0}</p> {/* ✅ Display booked seats */}
                <p>Remaining Seats: {remainingSeats}</p> {/* ✅ Display remaining seats */}
                <p>Reg No: {vehicle.registration_number}</p>
                <p>License Plate: {vehicle.license_plate}</p>
                <p>Location: {vehicle.current_location}</p>
                <p>Destination: {vehicle.departure}</p>
                <p>Departure Location: {vehicle.destination}</p>
                <p><strong>Departure Time: {vehicle.departure_time}</strong></p>
                <p><strong>Cost: {vehicle.cost}</strong></p>
              </div>
              <button
                type="button"
                onClick={() => handleMapSeatModal(vehicle)}
                className="btn bg-blue-600 text-white hover:text-black border-none w-full py-1 mt-2 text-xs"
                disabled={remainingSeats === 0} // ✅ Disable button if no seats left
              >
                {remainingSeats > 0 ? "Select Seat" : "Fully Booked"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-center text-gray-400">No vehicles match your search.</p>
  )}
</div>

          </form>
          {isMapSeatModalOpen && selectedVehicle && (
           <MapSeatModal
           vehicle={selectedVehicle}
           onClose={() => setIsMapSeatModalOpen(false)}
           refetchVehicles={refetch}  // ✅ Pass refetch as a prop
         />
         
          )}
        
      </div>
    </div>
  );
};

export default BookingForm;