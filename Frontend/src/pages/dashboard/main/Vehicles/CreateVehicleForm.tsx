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
  departure_time: yup.string(),
});

const CreateVehicleModal: React.FC<CreateVehicleModalProps> = ({ onClose }) => {
  const [createVehicle] = useCreateVehicleMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      const vehicleImage = data.image_url?.[0];
      if (vehicleImage) {
        if (vehicleImage.size > 2000000) {
          setImageError('The file is too large');
          setIsUploading(false);
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(vehicleImage.type)) {
          setImageError('Unsupported file format');
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', vehicleImage);
        formData.append('upload_preset', 'upload');

        const response = await axios.post('https://api.cloudinary.com/v1_1/dl3ovuqjn/image/upload', formData);

        if (response.status === 200) {
          imageUrl = response.data.secure_url;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const resourceData = {
        ...data,
        image_url: imageUrl,
        departure_time: data.departure_time,
      };

      await createVehicle(resourceData).unwrap();

      // Show success toast
      toast.success('Vehicle created successfully', {
        style: {
          background: 'green',
          color: 'white',
          borderRadius: '4px',
          padding: '10px',
          fontSize: '14px',
        },
        duration: 3000, // 3 seconds
      });

      onClose();
    } catch (error) {
      console.error('Failed to create vehicle', error);

      // Show error toast
      toast.error('Failed to create vehicle', {
        style: {
          background: 'red',
          color: 'white',
          borderRadius: '4px',
          padding: '10px',
          fontSize: '14px',
        },
        duration: 3000, // 3 seconds
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster position="top-right" />
      <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-2">Create New Vehicle</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Form Fields */}
            <div className="space-y-2">
              {/* Vehicle Name */}
              <div className="form-control">
                <label htmlFor="vehicle_name" className="label">
                  <span className="label-text">Vehicle Name</span>
                </label>
                <input
                  id="vehicle_name"
                  {...register('vehicle_name')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter vehicle name"
                />
                {errors.vehicle_name && (
                  <p className="text-red-500 text-xs">{errors.vehicle_name.message}</p>
                )}
              </div>

              {/* Registration Number */}
              <div className="form-control">
                <label htmlFor="registration_number" className="label">
                  <span className="label-text">Registration Number</span>
                </label>
                <input
                  id="registration_number"
                  {...register('registration_number')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter registration number"
                />
                {errors.registration_number && (
                  <p className="text-red-500 text-xs">{errors.registration_number.message}</p>
                )}
              </div>

              {/* License Plate */}
              <div className="form-control">
                <label htmlFor="license_plate" className="label">
                  <span className="label-text">License Plate</span>
                </label>
                <input
                  id="license_plate"
                  {...register('license_plate')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter license plate"
                />
                {errors.license_plate && (
                  <p className="text-red-500 text-xs">{errors.license_plate.message}</p>
                )}
              </div>

              {/* Capacity */}
              <div className="form-control">
                <label htmlFor="capacity" className="label">
                  <span className="label-text">Capacity</span>
                </label>
                <input
                  id="capacity"
                  {...register('capacity')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter capacity"
                />
                {errors.capacity && (
                  <p className="text-red-500 text-xs">{errors.capacity.message}</p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="form-control">
                <label htmlFor="vehicle_type" className="label">
                  <span className="label-text">Vehicle Type</span>
                </label>
                <input
                  id="vehicle_type"
                  {...register('vehicle_type')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter vehicle type"
                />
                {errors.vehicle_type && (
                  <p className="text-red-500 text-xs">{errors.vehicle_type.message}</p>
                )}
              </div>
            </div>

            {/* Right Column: Image Upload and Additional Fields */}
            <div className="space-y-2">
              {/* Current Location */}
              <div className="form-control">
                <label htmlFor="current_location" className="label">
                  <span className="label-text">Current Location</span>
                </label>
                <input
                  id="current_location"
                  {...register('current_location')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter current location"
                />
                {errors.current_location && (
                  <p className="text-red-500 text-xs">{errors.current_location.message}</p>
                )}
              </div>

              {/* Departure Location */}
              <div className="form-control">
                <label htmlFor="departure" className="label">
                  <span className="label-text">Departure Location</span>
                </label>
                <input
                  id="departure"
                  {...register('departure')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter departure location"
                />
                {errors.departure && (
                  <p className="text-red-500 text-xs">{errors.departure.message}</p>
                )}
              </div>

              {/* Destination */}
              <div className="form-control">
                <label htmlFor="destination" className="label">
                  <span className="label-text">Destination</span>
                </label>
                <input
                  id="destination"
                  {...register('destination')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter destination"
                />
                {errors.destination && (
                  <p className="text-red-500 text-xs">{errors.destination.message}</p>
                )}
              </div>

              {/* Departure Time */}
              <div className="form-control">
                <label htmlFor="departure_time" className="label">
                  <span className="label-text">Departure Time</span>
                </label>
                <input
                  id="departure_time"
                  type="time"
                  {...register('departure_time')}
                  className="input input-bordered w-full input-sm"
                />
                {errors.departure_time && (
                  <p className="text-red-500 text-xs">{errors.departure_time.message}</p>
                )}
              </div>

              {/* Cost Per Seat */}
              <div className="form-control">
                <label htmlFor="cost" className="label">
                  <span className="label-text">Cost Per Seat</span>
                </label>
                <input
                  id="cost"
                  type="number"
                  {...register('cost')}
                  className="input input-bordered w-full input-sm"
                  placeholder="Enter cost per seat"
                />
                {errors.cost && (
                  <p className="text-red-500 text-xs">{errors.cost.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label htmlFor="image_url" className="label">
                  <span className="label-text">Vehicle Image</span>
                </label>
                <input
                  type="file"
                  id="image_url"
                  {...register('image_url')}
                  className="input input-bordered w-full input-sm"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {errors.image_url && (
                  <p className="text-red-500 text-xs">{errors.image_url.message}</p>
                )}
                {imageError && (
                  <p className="text-red-500 text-xs">{imageError}</p>
                )}
                {imagePreview && (
                  <img src={imagePreview} alt="Image Preview" className="mt-2 max-w-full h-24 rounded-lg" />
                )}
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 text-sm"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicleModal;