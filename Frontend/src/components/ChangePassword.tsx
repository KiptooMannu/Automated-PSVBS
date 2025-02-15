import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usersAPI } from '../features/users/usersAPI';
import { Toaster, toast } from 'sonner';

type ChangePasswordFormData = {
    password: string;
    confirmPassword: string;
};

const schema = yup.object().shape({
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

interface ChangePasswordModalProps {
    email: string;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ email, onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(schema),
    });

    const [changePassword] = usersAPI.useChangePasswordMutation();
    const [isChangingPassword, setIsChangingPassword] = useState(false); // Loader state

    const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
        try {
            setIsChangingPassword(true); // Show loading indicator
            await changePassword({ email: email, password: data.password }).unwrap();
            toast.success('Password updated successfully');
            reset();
            onClose();
        } catch (error) {
            toast.error('There was a problem while changing the password');
            console.error('Error changing password:', error);
        } finally {
            setIsChangingPassword(false); // Hide loading indicator
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Toaster
                toastOptions={{
                    classNames: {
                        error: 'bg-red-400',
                        success: 'text-green-400',
                        warning: 'text-yellow-400',
                        info: 'bg-blue-400',
                    },
                }} />
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-auto">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Password */}
                    <div className="form-control lg:mr-8">
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="input input-bordered"
                            placeholder="New Password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-control lg:mr-8">
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            className="input input-bordered"
                            placeholder="Confirm Password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            {isChangingPassword ? (
                                <>
                                    <span className="loading loading-spinner text-white"></span>
                                    <span> Updating...</span>
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;