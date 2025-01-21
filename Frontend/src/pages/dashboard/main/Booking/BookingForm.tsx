import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFetchCarSpecsQuery, Vehicle } from "../../../../features/vehicles/vehicleAPI";

const BookingForm: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<string>(""); // State for filtering by type
  const [currentLocation, setCurrentLocation] = useState<string>(""); // State for filtering by location
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Selected vehicle

  const { data: vehicles, isLoading, isError } = useFetchCarSpecsQuery();
  console.log(vehicles)

  // Filter vehicles based on search criteria
  const filteredVehicles = vehicles?.filter((vehicle) => {
    const matchesType = vehicleType
      ? vehicle.vehicle_type.toLowerCase().includes(vehicleType.toLowerCase())
      : true;
    const matchesLocation = currentLocation
      ? vehicle.current_location.toLowerCase().includes(currentLocation.toLowerCase())
      : true;
    return matchesType && matchesLocation;
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) {
      alert("Please select a vehicle.");
      return;
    }
    alert(`Booking confirmed for vehicle: ${selectedVehicle.vehicle_name}`);
    // Further actions, e.g., API calls or redirection
  };

  if (isLoading)
    return <p className="text-center text-gray-500">Loading vehicles...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load vehicles. Please try again later.</p>;

  return (
    <div className="bg-slate-800 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-webcolor text-center p-5">Book Now!!!</h1>

      <div className="card lg:w-[100%] m-auto rounded-lg bg-slate-500 p-6">
        {/* Search Filters */}
        <form onSubmit={handleSubmit} className="space-y-6 ">
        <div className="flex flex-col lg:flex-row gap-4">
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
    <div className="flex flex-wrap justify-center gap-6 ">
      {filteredVehicles.map((vehicle) => (
        <div
          key={vehicle.registration_number}
          className={`card w-full sm:w-[45%] lg:w-[30%] bg-blue-100 shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
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
          
          {/* Card Content */}
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {vehicle.vehicle_name}
              <span
                className={`ml-4 inline-block px-3 py-1 text-sm font-medium rounded ${
                  vehicle.is_active ? "bg-green-300 text-green-900" : "bg-red-100 text-red-700"
                }`}
              >
                {vehicle.is_active ? "Available" : "Unavailable"}
              </span>
            </h3>
            <div className="space-y-1 text-green-900 text-sm">
              <p>Type: {vehicle.vehicle_type}</p>
              <p>Capacity: {vehicle.capacity}</p>
              <p>License Plate: {vehicle.license_plate}</p>
              <p>Location: {vehicle.current_location}</p>
              <p><strong>Remaining seats: 6</strong></p>
              <p><strong>cost: 1600</strong></p>
            </div>

            {/* Confirm Booking Button and map seat*/}
<button
  type="submit"
  className="btn bg-webcolor text-text-light hover:text-black border-none w-1/2 m-auto"
>
  <Link to="/map_seat" className="flex items-center">Select Seat
  </Link>
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
      </div>
    </div>
  );
};

export default BookingForm;