import React, { useState } from 'react';
import { useFetchCarSpecsQuery, Vehicle } from '../../../../features/vehicles/vehicleAPI';
import CreateVehicleButton from './CreateVehicleButton';
import CreateVehicleModal from './CreateVehicleForm';
import EditVehicleModal from './EditVehicle';
import DeleteVehicleModal from './DeleteVehicle';
import { SyncLoader } from 'react-spinners';

const VehiclesPage: React.FC = () => {
  const { data: vehicles, isLoading, error } = useFetchCarSpecsQuery();
  const [selectedResource, setSelectedResource] = useState<Vehicle | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedResource(vehicle);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedResource(vehicle);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="#37B7C3" size={20} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">Error loading resources: {error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Vehicles</h1>
          <CreateVehicleButton onOpenModal={openCreateModal} />
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles?.map((vehicle: Vehicle) => (
            <div
              key={vehicle.registration_number}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Card Content */}
              <div className="flex">
                {/* Left Side: Text Details */}
                <div className="flex-1 p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{vehicle.vehicle_name}</h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Registration:</span> {vehicle.registration_number}</p>
                    <p><span className="font-medium">Capacity:</span> {vehicle.capacity}</p>
                    <p><span className="font-medium">Location:</span> {vehicle.current_location}</p>
                    <p><span className="font-medium">Cost:</span> ${vehicle.cost}</p>
                    <p><span className="font-medium">License Plate:</span> {vehicle.license_plate}</p>
                    <p><span className="font-medium">Type:</span> {vehicle.vehicle_type}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(vehicle)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Right Side: Image */}
                <div className="w-1/3 flex-shrink-0">
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.vehicle_name}
                    className="w-full h-full object-cover rounded-r-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && <CreateVehicleModal onClose={closeCreateModal} />}

      {isEditModalOpen && selectedResource && (
        <EditVehicleModal
          vehicle={selectedResource}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedResource && (
        <DeleteVehicleModal
          registration_number={selectedResource.registration_number}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VehiclesPage;