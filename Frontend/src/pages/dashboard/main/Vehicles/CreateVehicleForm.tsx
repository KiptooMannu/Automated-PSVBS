import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateVehicleMutation } from '../../../../features/vehicles/vehicleAPI';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

interface CreateVehicleModalProps {
  onClose: () => void;
}


const CreateVehicleSchema = yup.object().shape({
  registration_number: yup.string().required('Registration number is required'),
  vehicle_name: yup.string().required('Vehicle name is required'),
  license_plate: yup.string().required('License plate is required'),
  capacity: yup.number().required('Capacity is required'),
  vehicle_type: yup.string().required('Vehicle type is required'),
  current_location: yup.string().required('Current location is required'),
  image_url: yup.mixed().required('Image URL is required'),
  cost: yup.number().required('Cost per seat is required').positive('Cost must be a positive number'),
  departure: yup.string().required('Departure location is required'),
  destination: yup.string().required('Destination is required'),
  departure_date: yup.date().min(new Date(), 'Departure date cannot be in the past'),
  departure_time: yup.string(),

  // departure_date: yup.date().required('Departure date is required').min(new Date(), 'Departure date cannot be in the past'),
  // departure_time: yup.string().required('Departure time is required'), 
});

const CreateVehicleModal: React.FC<CreateVehicleModalProps> = ({ onClose }) => {
  const [createVehicle] = useCreateVehicleMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview state
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(CreateVehicleSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);

      // Handle image file upload
      let imageUrl = '';
      const vehicleImage = data.image_url?.[0]; // Access the image file properly
      if (vehicleImage) {
        // Image validation
        if (vehicleImage.size > 2000000) { // 2MB limit
          setImageError('The file is too large');
          setIsUploading(false);
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(vehicleImage.type)) {
          setImageError('Unsupported file format');
          setIsUploading(false);
          return;
        }

        // Upload image to Cloudinary
        const formData = new FormData();
        formData.append('file', vehicleImage);
        formData.append('upload_preset', 'upload'); // upload preset

        const response = await axios.post('https://api.cloudinary.com/v1_1/dl3ovuqjn/image/upload', formData);

        if (response.status === 200) {
          imageUrl = response.data.secure_url;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Prepare the resource data with the uploaded image URL
      const resourceData = {
        ...data,
        image_url: imageUrl, // Ensure that the field is named image_url
      };

      // Send data to backend for creation
      const createdVehicle = await createVehicle(resourceData).unwrap();

      // Display image preview after creation
      if (createdVehicle?.image_url) {
        setImagePreview(createdVehicle.image_url); // Update state with the image URL
      }

      toast.success('Vehicle created successfully');
      onClose();
    } catch (error) {
      console.error('Failed to create vehicle', error);
      toast.error('Failed to create vehicle');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 max-h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4">Create New Vehicle</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Vehicle Name */}
          <div className="form-control">
            <input
              id="vehicle_name"
              {...register('vehicle_name')}
              className="input input-bordered"
              placeholder="Vehicle Name"
            />
            {errors.vehicle_name && (
              <p className="text-red-500 text-sm">{errors.vehicle_name.message}</p>
            )}
          </div>

          {/* Registration Number */}
          <div className="form-control">
            <input
              id="registration_number"
              {...register('registration_number')}
              className="input input-bordered"
              placeholder="Registration Number"
            />
            {errors.registration_number && (
              <p className="text-red-500 text-sm">{errors.registration_number.message}</p>
            )}
          </div>
          
          {/* License Plate */}
          <div className="form-control">
            <input
              id="license_plate"
              {...register('license_plate')}
              className="input input-bordered"
              placeholder="License Plate"
            />
            {errors.license_plate && (
              <p className="text-red-500 text-sm">{errors.license_plate.message}</p>
            )}
          </div>
          
          {/* Capacity */}
          <div className="form-control">
            <input
              id="capacity"
              {...register('capacity')}
              className="input input-bordered"
              placeholder="Capacity"
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm">{errors.capacity.message}</p>
            )}
          </div>
          
          {/* Vehicle Type */}
          <div className="form-control">
            <input
              id="vehicle_type"
              {...register('vehicle_type')}
              className="input input-bordered"
              placeholder="Vehicle Type"
            />
            {errors.vehicle_type && (
              <p className="text-red-500 text-sm">{errors.vehicle_type.message}</p>
            )}
          </div>
          
          {/* Current Location */}
          <div className="form-control">
            <input
              id="current_location"
              {...register('current_location')}
              className="input input-bordered"
              placeholder="Current Location"
            />
            {errors.current_location && (
              <p className="text-red-500 text-sm">{errors.current_location.message}</p>
            )}
          </div>

 {/* ✅ Departure Location */}
 <div className="form-control">
            <input
              id="departure"
              {...register('departure')}
              className="input input-bordered"
              placeholder="Departure Location"
            />
            {errors.departure && <p className="text-red-500 text-sm">{errors.departure.message}</p>}
          </div>

          {/* ✅ Destination */}
          <div className="form-control">
            <input
              id="destination"
              {...register('destination')}
              className="input input-bordered"
              placeholder="Destination"
            />
            {errors.destination && <p className="text-red-500 text-sm">{errors.destination.message}</p>}
          </div>

{/* ✅ Departure Time */}
<div className="form-control">
  <label htmlFor="departure_time" className="label">
    <span className="label-text">Departure Time</span>
  </label>
  <input
    id="departure_time"
    type="time"
    {...register('departure_time')}
    className="input input-bordered"
    placeholder="Select Departure Time"
  />
  {errors.departure_time && <p className="text-red-500 text-sm">{errors.departure_time.message}</p>}
</div>

{/* ✅ Cost Field */}
<div className="form-control">
  <label htmlFor="cost" className="label">
    <span className="label-text">Cost Per Seat</span>
  </label>
  <input
    id="cost"
    type="number"
    {...register('cost')}
    className="input input-bordered"
    placeholder="Enter cost per seat"
  />
  {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
</div>


          {/* Image Upload */}
          <div className="form-control">
            <input
              type="file"
              id="image_url"
              {...register('image_url')}
              className="input input-bordered"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  setImagePreview(URL.createObjectURL(file)); // Update preview
                }
              }}
            />
            {errors.image_url && (
              <p className="text-red-500 text-sm">{errors.image_url.message}</p>
            )}
            {imageError && (
              <p className="text-red-500 text-sm">{imageError}</p>
            )}
            {imagePreview && (
              <img src={imagePreview} alt="Image Preview" className="mt-4 max-w-full h-auto" />
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="mr-2 px-4 py-2 text-gray-700">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default CreateVehicleModal;
