import React, { useState, useEffect } from "react";
import { useFetchCarSpecsQuery, Vehicle } from "../../../../features/vehicles/vehicleAPI";
import MapSeatModal from "./MapSeat";

const BookingForm: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [departure, setDeparture] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isMapSeatModalOpen, setIsMapSeatModalOpen] = useState(false);

  const { data: vehicles, isLoading, isError, refetch } = useFetchCarSpecsQuery();

  const uniqueVehicles = vehicles
    ? Array.from(new Map(vehicles.map(vehicle => [vehicle.registration_number, vehicle])).values())
    : [];

  const filteredVehicles = uniqueVehicles.filter((vehicle) => {
    return (
      (vehicleType ? vehicle.vehicle_type === vehicleType : true) &&
      (departure ? vehicle.departure === departure : true) &&
      (destination ? vehicle.destination === destination : true)
    );
  });

  const handleMapSeatModal = (vehicle: Vehicle) => {
    if (!selectedVehicle || selectedVehicle.registration_number !== vehicle.registration_number) {
      setSelectedVehicle(vehicle);
      setIsMapSeatModalOpen(true);
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading vehicles...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load vehicles. Please try again later.</p>;

  return (
    <div className="overflow-x-auto bg-gradient-to-r from-blue-50 via-blue-800 to-white min-h-screen shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-webcolor text-center p-5">Book Now!!!</h1>

      {/* Filters Section */}
      <div className="card lg:w-full m-auto rounded-lg p-6">
        <form className="space-y-6">
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {/* Destination Filter */}
            <div className="w-full sm:w-auto">
              <label htmlFor="destination" className="block text-sm font-medium">Departure:</label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="select select-bordered w-full sm:w-auto"
              >
                <option value="">Select Departure</option>
                {Array.from(new Set(uniqueVehicles.map(vehicle => vehicle.destination))).map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Departure Filter */}
            <div className="w-full sm:w-auto">
              <label htmlFor="departure" className="block text-sm font-medium">Destination:</label>
              <select
                id="departure"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="select select-bordered w-full sm:w-auto"
              >
                <option value="">Select Destination</option>
                {Array.from(new Set(uniqueVehicles.map(vehicle => vehicle.departure))).map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="w-full sm:w-auto">
              <label htmlFor="vehicleType" className="block text-sm font-medium">Vehicle Type:</label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="select select-bordered w-full sm:w-auto"
              >
                <option value="">Select Vehicle Type</option>
                {Array.from(new Set(uniqueVehicles.map(vehicle => vehicle.vehicle_type))).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Vehicle List */}
      <div className="space-y-4 p-4">
        {filteredVehicles.length ? (
          <div className="flex flex-wrap justify-center gap-4">
            {filteredVehicles.map((vehicle, index) => {
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
                      <p>Booked Seats: {vehicle.booked_Seats || 0}</p>
                      <p>Remaining Seats: {remainingSeats}</p>
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
                      disabled={remainingSeats === 0}
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

      {/* Modal */}
      {isMapSeatModalOpen && selectedVehicle && (
        <MapSeatModal
          vehicle={selectedVehicle}
          onClose={() => setIsMapSeatModalOpen(false)}
          refetchVehicles={refetch}
        />
      )}
    </div>
  );
};

export default BookingForm;
