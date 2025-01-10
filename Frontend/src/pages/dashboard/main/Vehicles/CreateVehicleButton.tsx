interface CreateVehicleButtonProps {
    onOpenModal: () => void;
  }

const CreateVehicleButton: React.FC<CreateVehicleButtonProps> = ({ onOpenModal }) => {
    return (
      <button onClick={onOpenModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Create New Vehicle
      </button>
    );
  };
  
  export default CreateVehicleButton;