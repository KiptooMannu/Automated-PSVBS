import React, { useState } from 'react';
// import { useGetResourcesQuery, Resource } from '../../../../features/resources/resourcesAPI';
import { useFetchCarSpecsQuery,Vehicle } from '../../../../features/vehicles/vehicleAPI';
import CreateVehicleButton from './CreateVehicleButton';
import CreateVehicleModal from './CreateVehicleForm';
import EditVehicleModal from './EditVehicle';
import DeleteVehicleModal from './DeleteVehicle';
// import TagBadge from '../../../../components/TagBadge';
import { SyncLoader } from 'react-spinners';

const VehiclesPage: React.FC = () => {
  const { data: vehicle, isLoading, error } = useFetchCarSpecsQuery();
  console.log(vehicle)
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
      <div className="flex justify-center items-center h-96">
        <SyncLoader color={"#37B7C3"} size={20} />
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg text-red-500">Error loading resources: {error.toString()}</p>
      </div>
    );
  }

  return (
    // <div className="max-w-7xl mx-auto py-6 px-4 lg:px-0">
    <div className="overflow-x-auto bg-gradient-to-r from-blue-100  via-blue-400 to-white min-h-screen shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Vehicles</h1>
        <CreateVehicleButton onOpenModal={openCreateModal} />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mx-4">
        {vehicle?.map((vehicle: Vehicle) => (
          <li key={vehicle.registration_number} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <img
              src={vehicle.image_url}
              alt={vehicle.vehicle_name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-semibold text-white mb-4">{vehicle.vehicle_name}</h2>
            <p className="text-white mb-2 flex items-center justify-between">{vehicle.registration_number}</p>
            <h2 className="text-2xl font-semibold text-white mb-4">{vehicle.capacity}</h2>
            <p className="text-white mb-2 flex items-center justify-between">{vehicle.current_location}</p>
            <p className="text-white mb-2 flex items-center justify-between">{vehicle.license_plate}</p>
            <div className="text-sm text-white mb-2 flex items-center justify-between">
              <strong>{vehicle.vehicle_type}</strong>{' '}
            </div>
            <div className="flex justify-between mt-6 space-x-4">
              <button
                onClick={() => handleEditClick(vehicle)}
                className="bg-blue-500 p-2 text-white w-[100px] rounded hover:text-blue-700 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(vehicle)}
                className="bg-red-500 p-2 text-white w-[100px] rounded hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

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