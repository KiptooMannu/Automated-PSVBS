import React, { useState , useEffect } from "react";
import { useFetchCarSpecsQuery, Vehicle } from "../../../../features/vehicles/vehicleAPI";
import { useGetBookingVehicleQuery ,Tbooking } from "../../../../features/booking/bookingAPI";
import MapSeatModal from "./MapSeat";

const BookingForm: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<string>(""); // State for filtering by type
  const [currentLocation, setCurrentLocation] = useState<string>(""); // State for filtering by location
  const [destination, setDestination] = useState<string>(""); // State for filtering by destination
  const [departure, setDeparture] = useState<string>(""); // State for filtering by departure
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Selected vehicle
  const [isMapSeatModalOpen, setIsMapSeatModalOpen] = useState(false); // Modal state
  const [departureTime, setDepartureTime] = useState<Record<string, string>>({});

  const { data: vehicles, isLoading, isError } = useFetchCarSpecsQuery();
  // console.log("Vehicles:", vehicles);

   // Fetch bookings (departure times)
   const { data: bookings } = useGetBookingVehicleQuery();

   // Map departure times to vehicle IDs
   useEffect(() => {
    if (bookings) {
      const timesMap: Record<string, string> = {};
      bookings.forEach((booking: Tbooking) => {
        timesMap[booking.vehicle_id] = booking.departure_time;
      });
      setDepartureTime(timesMap);
    }
  }, [bookings]);
  

  // Handle Map Seat Modal
  const handleMapSeatModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle); // Set the selected vehicle
    setIsMapSeatModalOpen(true); // Open the modal
  };
  // console.log("Selected Vehicle:", selectedVehicle);
  useEffect(() => {
    console.log("Fetched Vehicles from API:", vehicles);
  }, [vehicles]);
  
  // Filter vehicles based on search criteria
// Filter vehicles based on search criteria
const filteredVehicles = vehicles?.filter((vehicle) => {
  const matchesType = vehicleType
    ? vehicle.vehicle_type?.toLowerCase().includes(vehicleType.toLowerCase()) // Safe optional chaining
    : true;
  const matchesLocation = currentLocation
    ? vehicle.current_location?.toLowerCase().includes(currentLocation.toLowerCase()) // Safe optional chaining
    : true;
  const matchesDeparture = departure
    ? vehicle.departure?.toLowerCase().includes(departure.toLowerCase()) // Safe optional chaining
    : true;
  const matchesDestination = destination
    ? vehicle.destination?.toLowerCase().includes(destination.toLowerCase()) // Safe optional chaining
    : true;

  return matchesType && matchesLocation && matchesDeparture && matchesDestination;
});


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
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Departure Location Input */}
            <div className="flex-1">
              <div className="form-control">
                <label htmlFor="departure" className="label">
                  <span className="label-text">Departure Location</span>
                </label>
                <input
                  id="departure"
                  type="text"
                  placeholder="Search by departure location📍"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            </div>
            {/* Destination Input */}
            <div className="flex-1">
              <div className="form-control">
                <label htmlFor="destination" className="label">
                  <span className="label-text">Destination</span>
                </label>
                <input
                  id="destination"
                  type="text"
                  placeholder="Search by destination📍"
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
            {/* Current Location Input */}
            <div className="flex-1">
              <div className="form-control">
                <label htmlFor="currentLocation" className="label">
                  <span className="label-text">Current Location</span>
                </label>
                <input
                  id="currentLocation"
                  type="text"
                  placeholder="Search by current location"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="space-y-4 p-6">
            {filteredVehicles?.length ? (
              <div className="flex flex-wrap justify-center gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.registration_number}
                    className={`card w-full sm:w-[45%] lg:w-[30%] bg-blue-200 shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                      selectedVehicle?.registration_number === vehicle.registration_number
                        ? "border-2 border-webcolor"
                        : "border border-gray-200"
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <img
                      src={vehicle.image_url}
                      alt={vehicle.vehicle_name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {vehicle.vehicle_name}
                        <span
                          className={`ml-4 inline-block px-3 py-1 text-sm font-medium rounded ${
                            vehicle.is_active
                              ? "bg-green-300 text-green-900"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {vehicle.is_active ? "Available" : "Unavailable"}
                        </span>
                      </h3>
                      <div className="space-y-1 text-green-900 text-sm">
                        <p>Type: {vehicle.vehicle_type}</p>
                        <p>Capacity: {vehicle.capacity}</p>
                        <p>Reg No: {vehicle.registration_number}</p>
                        <p>License Plate: {vehicle.license_plate}</p>
                        <p>Location: {vehicle.current_location}</p>
                        <p>Destination: {vehicle.departure}</p>
                        <p>Departure Location: {vehicle.destination}</p>
                        <p><strong>Departure Time: {departureTime[vehicle.registration_number] || "Not Available"}</strong></p>
                        <p><strong>Cost: {vehicle.cost}</strong></p>
                 
                      </div>
                      <button
                        type="button"
                        onClick={() => handleMapSeatModal(vehicle)}
                        className="btn bg-blue-600 text-text-white hover:text-black border-none w-1/2 m-auto"
                      >
                        Select Seat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">No vehicles match your search.</p>
            )}
          </div>
          </form>
          {isMapSeatModalOpen && selectedVehicle && (
            <MapSeatModal
              vehicle={selectedVehicle} // Pass the selected vehicle
              onClose={() => setIsMapSeatModalOpen(false)}
            />
          )}
        
      </div>
    </div>
  );
};

export default BookingForm;