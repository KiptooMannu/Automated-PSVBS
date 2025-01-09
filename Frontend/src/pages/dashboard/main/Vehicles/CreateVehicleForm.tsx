import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateVehicleMutation,Vehicle } from '../../../../features/vehicles/vehicleAPI';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

interface CreateVehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}
// Define the validation schema
const createVehicleSchema = yup.object().shape({
  vehicle_name: yup.string().required('Vehicle name is required'),
  vehicle_description: yup.string().required('Vehicle description is required'),
  vehicle_image: yup.string().required('Vehicle image is required'),
  vehicle_link: yup.string().required('Vehicle link is required'),
});

const CreateVehicleModal = ({ vehicle, onClose }: CreateVehicleModalProps) => {
  const [createVehicle] = useCreateVehicleMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(createVehicleSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      (true);
      //handle image upload
      let imageUrl = '';
          const blogImage = data.blog_image[0];
          if (blogImage) {
            // Image validation
            if (blogImage.size > 2000000) { // 2MB limit
              setImageError('The file is too large');
              setIsUploading(false);
              return;
            }
    
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(blogImage.type)) {
              setImageError('Unsupported file format');
              setIsUploading(false);
              return;
            }
            // Image upload to cloudinary
            const formData = new FormData();
            formData.append('file', blogImage);
            formData.append('upload_preset', 'j9grhett'); // upload preset
    
            const response = await axios.post('https://api.cloudinary.com/v1_1/dwsxs74ow/image/upload', formData);
    
            if (response.status === 200) {
              imageUrl = response.data.secure_url;
            } else {
              throw new Error('Failed to upload image');
            }
           }
           // Prepare the resource data with the uploaded image URL
           const blogData = {
            ...data,
            blog_image: imageUrl,
          };
      await createVehicle(data).unwrap();
      toast.success('Vehicle created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create vehicle');
    } finally {
      setIsUploading(true);
      (false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create Vehicle</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="vehicle_name">Vehicle Name</label>
            <input type="text" id="vehicle_name" {...register('vehicle_name')} />
            {errors.vehicle_name && <span>{errors.vehicle_name.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="vehicle_description">Vehicle Description</label>
            <input type="text" id="vehicle_description" {...register('vehicle_description')} />
            {errors.vehicle_description && <span>{errors.vehicle_description.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="vehicle_image">Vehicle Image</label>
            <input type="text" id="vehicle_image" {...register('vehicle_image')} />
            {errors.vehicle_image && <span>{errors.vehicle_image.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="vehicle_link">Vehicle Link</label>
            <input type="text" id="vehicle_link" {...register('vehicle_link')} />
            {errors.vehicle_link && <span>{errors.vehicle_link.message}</span>}
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}