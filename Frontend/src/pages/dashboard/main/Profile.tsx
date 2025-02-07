
import { useState } from 'react';
import userIcon from "../../../assets/usericon.png";
import { MdCheckCircle, MdHelp, MdEmail, MdPhone } from 'react-icons/md';
import { RootState } from '../../../app/store';
import { useSelector } from 'react-redux';
import { usersAPI } from '../../../features/users/usersAPI';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios';

type UserFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  image_url?: string;
  user_type?: string;
};

const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone_number: yup.string().required('Phone number is required')
});

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [updateUser] = usersAPI.useUpdateUserMutation();



  const user = useSelector((state: RootState) => state.user);
  const id = user.user?.user_id;
  const user_id = id ? id : 0;
  const [isUpdating, setIsUpdating] = useState(false);

  console.log('user_id:', user_id);
  console.log("Redux User State:", user);



const { data: userData, isLoading, error, refetch } = usersAPI.useGetUserByIdQuery(user_id, {
    pollingInterval: 6000,
    skip: !user_id,  // Skips the query if user_id is 0 or undefined
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
});

if (!user_id) {
  return <div>Error: User ID is missing!</div>;
}



  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (userData) {
      reset({
        first_name: userData.first_name ?? "",
        last_name: userData.last_name ?? "",
        email: userData.email ?? "",
        phone_number: userData.phone_number ?? "",
        image_url: userData.image_url ?? "",
      });
    }
  }, [userData, reset]);
  
  
  
  console.log('userData:', userData);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  const onSubmit: SubmitHandler<UserFormData> = async (formData) => {
    try {
      setIsUpdating(true);
      let imageUrl = formData.image_url || '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'yx7pvzix');

        const response = await axios.post('https://api.cloudinary.com/v1_1/dwsxs74ow/image/upload', formData);

        if (response.status === 200) {
          imageUrl = response.data.secure_url;
        } else {
          throw new Error('Failed to upload image');
        }
      }
      await updateUser({ id: user_id, ...formData, image_url: imageUrl }).unwrap();
      setIsEditMode(false);
      refetch();
      
      console.log('User updated successfully');
    } catch (err) {
     
      console.error('Error updating user', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return <div>Error loading user data.</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <>
      <div className="overflow-x-auto bg-gradient-to-r from-blue-100 via-blue-200 to-white min-h-screen shadow-lg flex flex-col items-center justify-center">
        <div className="flex flex-col items-center md:flex-row md:items-start border-b-2 border-green-600 pb-6">
          <div className="relative mb-6 md:mb-0 md:mr-8 flex justify-center items-center">
          
          <img src={userData?.image_url || userIcon}
  className="rounded-full h-32 w-32 object-cover border-4 border-white cursor-pointer"
  alt="User Avatar"
/>


            {userData.is_verified ? (
              <div className="absolute bottom-0 right-0 p-1 bg-green-700 rounded-full border-2 border-white">
                <MdCheckCircle className="text-green-600 w-6 h-6" title="Verified" />
              </div>
            ) : (
              <div
                className="absolute bottom-0 right-0 p-1 bg-gray-700 rounded-full border-2 border-white cursor-pointer"
                title="Not Verified"
              >
                <MdHelp className="text-white w-6 h-6" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">
  {userData?.first_name} {userData?.last_name}
</h1>

    <div className="space-y-2">
        <div className="flex items-center">
            <MdEmail className="text-red-600 mr-2" />
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-lg ml-2">{userData?.email}</p>
        </div>
        <div className="flex items-center">
            <MdPhone className="text-blue-700 mr-2" />
            <p className="text-lg font-semibold">Phone:</p>
            <p className="text-lg ml-2">{userData?.phone_number}</p>
        </div>
    </div>
</div>

        </div>
  
        <div className="flex justify-center mt-6 space-x-4">
          <button className="btn  bg-orange-500 text-cyan-50" onClick={() => setIsEditMode(true)}>Edit Profile</button>
        </div>
  
        {isEditMode && (
          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
  <label htmlFor="first_name" className="label">First Name</label>
  <input id="first_name" className="input input-bordered" {...register("first_name")} />
  {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
</div>

                <div className="form-control">
                  <label htmlFor="last_name" className="label">Last Name</label>
                  <input id="last_name" className="input input-bordered" defaultValue={userData?.last_name || ""} {...register("last_name")} />
                </div>
                <div className="form-control">
                  <label htmlFor="email" className="label">Email</label>
                  <input id="email" className="input input-bordered" defaultValue={userData?.email || ""} {...register("email")} />
                  
                </div>
                <div className="form-control">
                  <label htmlFor="phone_number" className="label">Phone Number</label>
                  <input id="phone_number" className="input input-bordered" defaultValue={userData?.phone_number || ""} {...register("phone_number")} />
                </div>
                <div className="form-control">
                  <label htmlFor="password" className="label">Password</label>
                  <input
                    id="password"
                    className="input input-bordered"
                    defaultValue="****"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="confirm_password" className="label">Confirm Password</label>
                  <input
                    id="confirm_password"
                    className="input input-bordered"
                    defaultValue="****"
                  />
                </div>
              </div>
  
              <div className="form-control mt-4">
                <label htmlFor="image" className="label">Profile Image</label>
                <input
                  type="file"
                  id="image"
                  className="file-input file-input-bordered"
                  onChange={handleImageUpload}
                />
              </div>
  
              <div className="flex justify-end mt-4 space-x-4">
                <button type="button" className="btn bg-gray-500 text-white" onClick={() => setIsEditMode(false)}>Cancel</button>
                <button type="submit" className="btn bg-blue-500 text-white" disabled={isUpdating}>
  {isUpdating ? "Updating..." : "Update Profile"}
</button>

              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}  

export default Profile;
