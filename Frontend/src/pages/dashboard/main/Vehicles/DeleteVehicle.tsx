import React from 'react';
// import { useDeleteResourceMutation } from '../../../../features/resources/resourcesAPI';
import { useDeleteVehicleMutation } from '../../../../features/vehicles/vehicleAPI';
import { Toaster, toast } from 'sonner';

interface DeleteVehicleModalProps {
  registration_number: string;
  onClose: () => void;
}

const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = ({ registration_number, onClose }) => {
  const [deleteVehicle] = useDeleteVehicleMutation();

  const handleDelete = async () => {
    try {
      await deleteVehicle(registration_number).unwrap();
      toast.success('Vehicle deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete Vehicle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Delete Vehicle</h2>
        <p>Are you sure you want to delete this Vehicle?</p>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 px-4 py-2 text-gray-700">Cancel</button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVehicleModal;
