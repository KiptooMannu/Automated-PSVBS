import React, { useState,  } from "react";
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




<div className="flex flex-col items-center w-full px-4">
  {/* Filters Section - Full Width */}
  <div className="w-full max-w-5xl mb-2">
    <form className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow-md">
      <div>
        <label htmlFor="departure" className="block text-sm font-medium">Departure:</label>
        <select id="departure" value={departure} onChange={(e) => setDeparture(e.target.value)}
          className="select select-bordered w-full">
          <option value="">Select Departure</option>
          {Array.from(new Set(uniqueVehicles.map(vehicle => vehicle.departure))).map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="destination" className="block text-sm font-medium">Destination:</label>
        <select id="destination" value={destination} onChange={(e) => setDestination(e.target.value)}
          className="select select-bordered w-full">
          <option value="">Select Destination</option>
          {Array.from(new Set(uniqueVehicles.map(vehicle => vehicle.destination))).map(dest => (
            <option key={dest} value={dest}>{dest}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="vehicleType" className="block text-sm font-medium">Vehicle Type:</label>
        <select id="vehicleType" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
          className="select select-bordered w-full">
          <option value="">Select Vehicle Type</option>
          {Array.from(new Set(uniqueVehicles.map(vehicle => vehicle.vehicle_type))).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </form>
  </div>

  {/* Vehicle Grid (3x2 layout, full visibility) */}
  <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full max-w-5xl">
    {filteredVehicles.slice(0, 6).map((vehicle, index) => {
      const remainingSeats = Math.max((vehicle.capacity - 1) - (Number(vehicle.booked_Seats) || 0), 0);

      return (
        <div
          key={`${vehicle.registration_number}-${index}`}
          className={`card bg-blue-200 shadow-md rounded-lg p-4 transform transition-all duration-300 hover:scale-105 ${
            selectedVehicle?.registration_number === vehicle.registration_number
              ? "border-2 border-webcolor"
              : "border border-gray-200"
          }`}
          onClick={() => setSelectedVehicle(vehicle)}
        >
          <img src={vehicle.image_url} alt={vehicle.vehicle_name} className="w-full h-24 object-cover rounded-lg" />
          <h3 className="text-sm font-semibold text-gray-800 mt-2">{vehicle.vehicle_name}</h3>
          <p className="text-xs text-gray-700">{vehicle.vehicle_type} | {vehicle.capacity} Seats</p>
          <p className="text-xs text-gray-700">Booked: {vehicle.booked_Seats || 0} | Remaining: {remainingSeats}</p>
          <p className="text-xs text-gray-700">Reg No: {vehicle.registration_number}</p>
          <p className="text-xs text-gray-700">License: {vehicle.license_plate}</p>
          <p className="text-xs text-gray-700">From: {vehicle.departure} → To: {vehicle.destination}</p>
          <p className="text-xs text-gray-700"><strong>Departure: {vehicle.departure_time}</strong></p>
          <p className="text-xs text-gray-700"><strong>Cost: {vehicle.cost}</strong></p>
          <button
            type="button"
            onClick={() => handleMapSeatModal(vehicle)}
            className="btn bg-blue-600 text-white hover:text-black border-none text-xs px-4 py-1 mt-1 w-full"
            disabled={remainingSeats === 0}
          >
            {remainingSeats > 0 ? "Select Seat" : "Fully Booked"}
          </button>
        </div>
      );
    })}
  </div>
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
