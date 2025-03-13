import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usersAPI } from "../../features/users/usersAPI";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Navbar from "../../components/Navbar/Navbar";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  username: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [createUser, { error }] = usersAPI.useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Submitting data:", data);
    try {
      const response = await createUser(data);
      console.log("Response data:", response); // success
      toast.success("Registration successful", {
        position: "top-right",
        autoClose: 3000,
      }); // Show success toast
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after registration
      }, 1000);
    } catch (err) {
      if (error) {
        console.error("API error:", error); // error
        if ("data" in error && error.data) {
          // Parse and display error details from the response
          toast.error("Invalid credentials", {
            position: "top-right",
            autoClose: 3000,
          }); // Show error toast
          console.error("Error details:", error.data);
        }
      }
    }
  };

  return (
    <div>
      {/* Toast Container */}
      <ToastContainer />

      <Navbar />

      <div className="hero-content flex-col lg:flex-row-reverse lg:gap-16 h-full max-w-full border-2">
        <div className="card bg-base-100 w-full lg:w-[40%] shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="form-control">
              <input
                type="text"
                placeholder="Firstname"
                className="input input-bordered"
                required
                {...register("first_name")}
              />
              <p className="text-red-500">{errors.first_name?.message}</p>
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="lastname"
                className="input input-bordered"
                required
                {...register("last_name")}
              />
              <p className="text-red-500">{errors.last_name?.message}</p>
            </div>
            <div className="form-control">
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
                {...register("email")}
              />
              <p className="text-red-500">{errors.email?.message}</p>
            </div>

            <div className="form-control">
              <input
                type="string"
                placeholder="phone number"
                className="input input-bordered"
                required
                {...register("phone_number")}
              />
              <p className="text-red-500">{errors.phone_number?.message}</p>
            </div>

            <div className="form-control">
              <input
                type="text"
                placeholder="username"
                className="input input-bordered"
                required
                {...register("username")}
              />
              <p className="text-red-500">{errors.username?.message}</p>
            </div>

            <div className="form-control">
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
                {...register("password")}
              />
              <p className="text-red-500">{errors.password?.message}</p>
            </div>

            <div className="form-control">
              <input
                type="password"
                placeholder="confirm password"
                className="input input-bordered"
                required
                {...register("confirmPassword")}
              />
              <p className="text-red-500">{errors.confirmPassword?.message}</p>
            </div>
            <div>
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>

            <div className="form-control mt-2">
              <button type="submit" className="btn bg-webcolor text-text-light hover:text-black border-none">
                Register
              </button>
            </div>

            <div className="form-control mt-2">
              <Link to="/login" className="label-text-alt link link-hover">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>

        <div className="hidden lg:block w-full lg:w-[35%]">
          <img
            src="https://www.gitsoftwaresolutions.com/assets/whyUs/3.png"
            alt="auth"
            className="w-full h-full object-cover lg:object-fill rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;