import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RootState } from '../../../app/store';
import { usersAPI } from '../../../features/users/usersAPI';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Footer from '../../../components/Footer/Footer';

type UserFormData = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    image_url?: string;
};

const schema = yup.object().shape({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('last name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phone_number: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
});

const Profile = () => {
    const user = useSelector((state: RootState) => state.user);
    const role = user.user?.role;
    const id = user.user?.user_id;
    const user_id = id ? id : 0;
    const { data: userData, isLoading, error, refetch } = usersAPI.useGetUserByIdQuery(user_id, {
        pollingInterval: 6000,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const [updateUser] = usersAPI.useUpdateUserMutation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); // State for updating loader
    const [image, setImage] = useState<File | null>(null); // State for storing selected image

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => { // Populate form fields with user data when available
        if (userData) {
            reset({
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                phone_number: userData.phone_number,
                image_url: userData.image_url,
            });
        }
    }, [userData, reset]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the first file selected by the user
        if (file) {
            setImage(file); // Set the selected file to the state
        }
    };

    const onSubmit: SubmitHandler<UserFormData> = async (formData) => {
        try {
            setIsUpdating(true); // Show updating loader
            let imageUrl = formData.image_url || '';
            if (image) {
                const formData = new FormData(); // Create a new FormData instance, form data is in form of key/value pairs ie formdata = {key: value}
                formData.append('file', image); // Append the file to the FormData instance
                formData.append('upload_preset', 'upload');// used to upload images to cloudinary

                const response = await axios.post('https://api.cloudinary.com/v1_1/dl3ovuqjn/image/upload', formData); // dl3ovuqjn is the cloudinary account name

                if (response.status === 200) {
                    imageUrl = response.data.secure_url; // Get the image URL from the response
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            await updateUser({ id: user_id, ...formData, image_url: imageUrl }).unwrap(); // Update user data ...formData is used to spread the form data which contains the updated user data
            setIsEditMode(false);
            refetch(); // Refetch user data to display updated data
            toast.success('User updated successfully');
        } catch (err) {
            console.error('Error updating user', err);
            toast.error('Error updating user');
        } finally {
            setIsUpdating(false); // Hide updating loader
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator while fetching user data
    }

    if (error) {
        return <div>Error loading user data.</div>; // Handle error state
    }

    if (!userData) {
        return <div>No user data available.</div>; // Handle case when userData is not available
    }

    return (
        <>
            <Toaster
                toastOptions={{
                    classNames: {
                        error: 'bg-red-400',
                        success: 'text-green-400',
                        warning: 'text-yellow-400',
                        info: 'bg-blue-400',
                    },
                }}
            />
            <div className="card shadow-xl mx-auto p-4 rounded-md bg-slate-200 min-h-screen">
                <div className="border-b-2 border-slate-600 pb-4">
                    <div className="flex justify-center">
                        <img src={userData.image_url || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} className="rounded-full h-28 w-28 object-cover border-4 border-white" alt="User Avatar" />
                    </div>
                    <div className="flex flex-col justify-center mt-4 text-center">
                        <h1 className="text-3xl font-bold">{userData.first_name} {userData.last_name}<span className="badge bg-webcolor text-text-light mx-4 p-3">{role}</span></h1>
                        <p className="text-lg">Email: {userData.email}</p>
                        <p className="text-lg">Phone: {userData.phone_number}</p>
                       
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button onClick={() => setIsEditMode(true)} className="btn bg-webcolor text-text-light hover:text-black">Update Profile</button>
                </div>

                {isEditMode && (
                    <div className="p-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="form-control">
                                <label htmlFor="first_name" className="label">First Name</label>
                                <input type="text" id="full_name" className="input input-bordered" {...register("first_name")} />
                                <p className="text-red-500">{errors.first_name?.message}</p>
                            </div>
                            <div className="form-control">
                                <label htmlFor="last_name" className="label">last Name</label>
                                <input type="text" id="full_name" className="input input-bordered" {...register("last_name")} />
                                <p className="text-red-500">{errors.last_name?.message}</p>
                            </div>
                            <div className="form-control">
                                <label htmlFor="email" className="label">Email</label>
                                <input type="email" id="email" className="input input-bordered" {...register("email")} />
                                <p className="text-red-500">{errors.email?.message}</p>
                            </div>
                            <div className="form-control">
                                <label htmlFor="contact_phone" className="label">Phone Number</label>
                                <input type="text" id="contact_phone" className="input input-bordered" {...register("phone_number")} />
                                <p className="text-red-500">{errors.phone_number?.message}</p>
                            </div>
                            <div className="form-control">
                                <label htmlFor="profile_image" className="label">Profile Image</label>
                                <input type="file" id="profile_image" className="input input-bordered bg-slate-200" accept="image/*" onChange={handleImageUpload} />
                            </div>
                            <div className="mt-4 flex justify-around">
                                <button onClick={() => setIsEditMode(false)} className="btn bg-red-400 text-text-light hover:text-black">Cancel</button>
                                <button type="submit" className="btn bg-webcolor text-text-light hover:text-black">
                                    {isUpdating ? (
                                        <>
                                            <span className="loading loading-spinner text-text-light"></span>
                                            <span className='text-text-light'>Updating...</span>
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Profile;
